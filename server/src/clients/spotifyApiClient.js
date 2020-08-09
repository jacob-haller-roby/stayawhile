import redisClient from './redisClient';
import {stringify} from 'query-string';
import request from 'request';
import logger from "../util/logger";

const getAccessToken = (userId) => {
    if (!userId) {
        logger.error('No user Id provided');
    }
    return redisClient.getAccessToken(userId);
}

const spotifyWithCreds = (method) =>
    (uri, paramsArg = {}, bodyArg = {}) =>
        async (userId, accessTokenArg, callback = (response) => response) => {
    const params = Object.values(paramsArg).some(param => !!param) ? ('?' + stringify(paramsArg)) : '';
    const body = Object.values(bodyArg).some(value => !!value) ? JSON.stringify(bodyArg) : null;
    const accessToken = !accessTokenArg ? await getAccessToken(userId) : accessTokenArg;
    const options = {
        url: `https://api.spotify.com/v1/${uri}${params}`,
        headers: {
            'Authorization': 'Bearer ' + accessToken
        },
        method,
        body
    };

        return await new Promise((resolve, reject) => {
            request(options, (error, response, body) => {
                let jsonBody = {};
                try {
                    if (!!body) {
                        jsonBody = JSON.parse(body);
                    }
                } catch {
                    logger.error("Received non-json response from spotify:");
                    logger.error(body);
                    logger.error("Options sent: ");
                    logger.error(options);
                    reject({error: "Cannot Parse Response from Spotify"})
                }
                if (jsonBody.error) {
                    logger.error("Received error from spotify:");
                    logger.error(body);
                    logger.error("Options sent: ");
                    logger.error(options);
                    reject(jsonBody);
                }
                resolve(jsonBody);
            })
        })
            .then(callback);
            //FIXME: MOVE TO CONTROLLER?
            //
            // .catch(jsonBody => {
            //
            //     logger.error("ERROR:", jsonBody);
            //     if (jsonBody.error.status === 401) {
            //         logger.error("Clearing user's refresh token");
            //         res.clearCookie(CONSTANTS.SPOTIFY_USER_ID);
            //         errorResponseFactory.create401(res, "Access token not found, requesting re-login");
            //     }
            // });
}

const getSpotify = spotifyWithCreds('GET');
const postSpotify = spotifyWithCreds('POST');
const putSpotify = spotifyWithCreds('PUT');

const spotifyApiClient = {};
spotifyApiClient.me = () => getSpotify('me');
spotifyApiClient.getDevices = () => getSpotify('me/player/devices');
spotifyApiClient.getStatus = () => getSpotify('me/player');
spotifyApiClient.play = (spotify_uri, deviceId) => putSpotify('me/player/play', {device_id: deviceId}, {context_uri: spotify_uri});
spotifyApiClient.playTrack = (trackUri, deviceId) => putSpotify('me/player/play', {device_id: deviceId}, {uris: [trackUri]});
spotifyApiClient.pause = putSpotify('me/player/pause');
spotifyApiClient.shuffle = () => putSpotify('me/player/shuffle', {state: true});
spotifyApiClient.repeat = () => putSpotify('me/player/repeat', {state: 'context'});
spotifyApiClient.next = () => postSpotify('me/player/next');
spotifyApiClient.transfer = (deviceId) => putSpotify('me/player', {}, {play: true, device_ids: [deviceId]});
const playlistPagingLoop = (uri) => async (userId) => {
    let response = await getSpotify(uri)(userId);
    let playlists = [...response.items];
    while (response.next) {
        let next = response.next.split('/v1/')[1].replace('limit=20','');
        response = await getSpotify(next)(userId);
        if(response) {
            playlists.push(...response.items);
        }
    }
    return playlists;
}
spotifyApiClient.playlists = () => playlistPagingLoop('me/playlists');
spotifyApiClient.suggestedPlaylists = (userId) => async () => (await playlistPagingLoop('users/bezoing/playlists')(userId, null, (playlists => playlists.filter(playlists.name.includes(':')))));

export default spotifyApiClient;