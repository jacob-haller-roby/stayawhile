import CONSTANTS from '../constants';
import redisClient from './redisClient';
import queryString, {stringify} from 'query-string';
import request from 'request';

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
        url: `https://api.spotify.com/v1/${uri}?` + queryString.stringify(body),
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
        });
    });
}
const getSpotify = (uri) => spotifyWithCreds('GET')(uri, {});
const postSpotify = spotifyWithCreds('POST');

const spotifyApiClient = {};
spotifyApiClient.me = getSpotify('me');

export default spotifyApiClient;