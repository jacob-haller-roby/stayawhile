import CONSTANTS from '../constants';
import redisClient from './redisClient';
import {stringify} from 'query-string';
import request from 'request';
import logger from "../util/logger";
import errorResponseFactory from "../util/errorResponseFactory";

const getAccessToken = async (req, res) => {
    return await new Promise((resolve, reject) => {
        const refresh_token = req.cookies[CONSTANTS.SPOTIFY_REFRESH_TOKEN];
        if (!refresh_token) {
            reject('No refresh token in cookies');
        }
        resolve(redisClient.getAccessToken(refresh_token));
    })
        .catch(() => res.status(403).send({error: "Error Getting Access Token"}));

};

const spotifyWithCreds = (method) => (uri, params = {}, body) => async (req, res) => {
    const hasParams = Object.values(params).some(paramValue => !!paramValue);
    let urlParams = hasParams ? ('?' + stringify(params)) : '';
    const options = {
        url: `https://api.spotify.com/v1/${uri}` + urlParams,
        headers: {
            'Authorization': 'Bearer ' + await getAccessToken(req, res)
        },
        method
    };

    if(body) {
        options.body = JSON.stringify(body);
    }

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
                logger.error("Received non-json response from spotify:");
                logger.error(body);
                logger.error("Options sent: ");
                logger.error(options);
                reject(jsonBody);
            }
            resolve(jsonBody);
        })
    })
        .catch(jsonBody => {
            logger.error("ERROR:", jsonBody);
            if (jsonBody.error.status === 401) {
                logger.error("Clearing user's refresh token");
                res.clearCookie(CONSTANTS.SPOTIFY_REFRESH_TOKEN);
                errorResponseFactory.create401(res, "Access token not found, requesting re-login");
            }
        });
}
const getSpotify = spotifyWithCreds('GET');
const postSpotify = spotifyWithCreds('POST');
const putSpotify = spotifyWithCreds('PUT');

const spotifyApiClient = {};
spotifyApiClient.me = getSpotify('me');
spotifyApiClient.getDevices = getSpotify('me/player/devices');
spotifyApiClient.getStatus = getSpotify('me/player');
spotifyApiClient.play = (spotify_uri, deviceId) => putSpotify('me/player/play', {device_id: deviceId}, {context_uri: spotify_uri});
spotifyApiClient.pause = putSpotify('me/player/pause');
spotifyApiClient.shuffle = () => putSpotify('me/player/shuffle', {state: true});
spotifyApiClient.next = () => postSpotify('me/player/next');
spotifyApiClient.transfer = (deviceId) => putSpotify('me/player', {}, {play: true, device_ids: [deviceId]});
const playlistPagingLoop = async (uri, req, res) => {
    let response = await getSpotify(uri)(req, res);
    let playlists = [...response.items];
    while (response.next) {
        let next = response.next.split('/v1/')[1].replace('limit=20','');
        response = await getSpotify(next)(req, res);
        if(response) {
            playlists.push(...response.items);
        }
    }
    return playlists;
}
spotifyApiClient.playlists = async (req, res) => {
    return playlistPagingLoop('me/playlists', req, res);
};
spotifyApiClient.suggestedPlaylists = async (req, res) => {
    const playlists = await playlistPagingLoop('users/bezoing/playlists', req, res);
    return playlists.filter(playlist => playlist.name.includes(':'));
};

export default spotifyApiClient;