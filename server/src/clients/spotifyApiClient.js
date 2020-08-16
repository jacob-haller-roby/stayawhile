import {stringify} from 'query-string';
import request from 'request';
import logger from "../util/logger";


const spotifyApiClient = {};
spotifyApiClient.init = (redisClient) => {
    spotifyApiClient.redisClient = redisClient;
};

spotifyApiClient.getAccessToken = (userId) => {
    if (!userId) {
        logger.error('No user Id provided');
    }
    return spotifyApiClient.redisClient.getAccessToken(userId);
}

spotifyApiClient.spotifyWithCreds = (method) =>
    (uri, paramsArg = {}, bodyArg = {}) =>
        async (userId, accessTokenArg, callback = (response) => response) => {
    const params = Object.values(paramsArg).some(param => !!param || param === 0) ? ('?' + stringify(paramsArg)) : '';
    const body = Object.values(bodyArg).some(value => !!value || value === 0) ? JSON.stringify(bodyArg) : null;
    const accessToken = !accessTokenArg ? await spotifyApiClient.getAccessToken(userId) : accessTokenArg;
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
}

spotifyApiClient.getSpotify = spotifyApiClient.spotifyWithCreds('GET');
spotifyApiClient.postSpotify = spotifyApiClient.spotifyWithCreds('POST');
spotifyApiClient.putSpotify = spotifyApiClient.spotifyWithCreds('PUT');


spotifyApiClient.me = () => spotifyApiClient.getSpotify('me');
spotifyApiClient.getDevices = () => spotifyApiClient.getSpotify('me/player/devices');
spotifyApiClient.getStatus = () => spotifyApiClient.getSpotify('me/player');
spotifyApiClient.play = (spotify_uri, deviceId) => spotifyApiClient.putSpotify('me/player/play', {device_id: deviceId}, {context_uri: spotify_uri});
spotifyApiClient.playTrack = (trackUri, deviceId) => spotifyApiClient.putSpotify('me/player/play', {device_id: deviceId}, {uris: [trackUri]});
spotifyApiClient.pause = () => spotifyApiClient.putSpotify('me/player/pause');
spotifyApiClient.shuffle = (state) => spotifyApiClient.putSpotify('me/player/shuffle', {state});
spotifyApiClient.repeat = (state) => spotifyApiClient.putSpotify('me/player/repeat', {state});
spotifyApiClient.next = () => spotifyApiClient.postSpotify('me/player/next');
spotifyApiClient.previous = () => spotifyApiClient.postSpotify('me/player/previous');
spotifyApiClient.transfer = (deviceId) => spotifyApiClient.putSpotify('me/player', {}, {play: true, device_ids: [deviceId]});
spotifyApiClient.volume = (volume_percent) => spotifyApiClient.putSpotify('me/player/volume', {volume_percent});
const playlistPagingLoop = (uri) => async (userId) => {
    let response = await spotifyApiClient.getSpotify(uri)(userId);
    let playlists = [...response.items];
    while (response.next) {
        let next = response.next.split('/v1/')[1].replace('limit=20','');
        response = await spotifyApiClient.getSpotify(next)(userId);
        if(response) {
            playlists.push(...response.items);
        }
    }
    return playlists;
}
spotifyApiClient.playlists = () => playlistPagingLoop('me/playlists');
spotifyApiClient.suggestedPlaylists = () => async (userId) => {
    const suggestedPlaylists = await playlistPagingLoop('users/bezoing/playlists')(userId);
    return suggestedPlaylists.filter(playlist => playlist.name.includes(':'));
};

export default spotifyApiClient;