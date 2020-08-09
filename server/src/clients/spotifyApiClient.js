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

const spotifyWithCreds = (method) => (uri, body) => async (req, res) => {
    const options = {
        url: `https://api.spotify.com/v1/${uri}?` + stringify(body),
        headers: {
            'Authorization': 'Bearer ' + await getAccessToken(req, res)
        },
        method
    };

    return await new Promise((resolve, reject) => {
        request(options, (error, response, body) => {
            let jsonBody = JSON.parse(body);
            if (jsonBody.error) {
                reject(jsonBody);
            }
            resolve(jsonBody);
        })
    })
        .catch(jsonBody => {
            logger.error("ERROR:", jsonBody);
            if (jsonBody.error.status === 403 || jsonBody.error.status === 401) {
                logger.error("Clearing user's refresh token");
                res.clearCookie(CONSTANTS.SPOTIFY_REFRESH_TOKEN);
                errorResponseFactory.create401(res, "Access token not found, requesting re-login");
            }
        });
}
const getSpotify = (uri) => spotifyWithCreds('GET')(uri, {});
const postSpotify = spotifyWithCreds('POST');

const spotifyApiClient = {};
spotifyApiClient.me = getSpotify('me');
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