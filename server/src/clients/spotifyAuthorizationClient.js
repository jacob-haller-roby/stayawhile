import queryString from 'query-string';
import redisClient from "./redisClient";
import request from 'request';
import CONSTANTS from '../constants';
import spotifyApiClient from "./spotifyApiClient";
import errorResponseFactory from "../util/errorResponseFactory";

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const REDIRECT_URI = process.env.HOST + "/spotify/callback";
const STATE_KEY = 'state_key';

const spotifyAuthorizationClient = {};

const generateRandomString = function(length) {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
};

spotifyAuthorizationClient.login = (req, res) => {
    const state = generateRandomString(16);
    res.cookie(STATE_KEY, state);
    return res.send({
        loginRedirect: 'https://accounts.spotify.com/authorize?' +
                queryString.stringify({
                    response_type: 'code',
                    client_id: CLIENT_ID,
                    scope: 'user-read-private user-read-email user-modify-playback-state user-read-playback-state user-read-currently-playing streaming playlist-read-private',
                    redirect_uri: REDIRECT_URI,
                    state: state,
                    show_dialog: true
                })
        }
    )
};

spotifyAuthorizationClient.loginCallback = (req, res) => {
    const code = req.query.code || null;
    const state = req.query.state || null;
    const storedState = req.cookies ? req.cookies[STATE_KEY] : null;

    if (state === null || state !== storedState) {
        res.redirect('/#' +
            queryString.stringify({
                error: 'state_mismatch'
            }));
    } else {
        res.clearCookie(STATE_KEY);
        const authOptions = {
            url: 'https://accounts.spotify.com/api/token',
            form: {
                code: code,
                redirect_uri: REDIRECT_URI,
                grant_type: 'authorization_code'
            },
            headers: {
                'Authorization': 'Basic ' + (new Buffer(CLIENT_ID + ':' + CLIENT_SECRET).toString('base64'))
            },
            json: true
        };

        request.post(authOptions, function(error, response, body) {
            let accessToken, refreshToken;
            if (!error && response.statusCode === 200) {

                accessToken = body.access_token;
                refreshToken = body.refresh_token;

                //res.cookie(CONSTANTS.SPOTIFY_REFRESH_TOKEN, refresh_token, {httpOnly: true, sameSite: 'strict', secure: true});
                //redisClient.setAccessToken(refresh_token, access_token);
            } else {
                console.error('ERROR: ' + error);
                return errorResponseFactory.create401(res, "Invalid login");
            }
            spotifyApiClient.me(accessToken)(req, res)
                .then(async profile => {
                    // userId -> refreshToken
                    // userId -> accessToken
                    // cookie[userId]
                    await redisClient.setAccessToken(profile.id, accessToken);
                    await redisClient.setRefreshToken(profile.id, refreshToken);
                    res.cookie(CONSTANTS.SPOTIFY_USER_ID, profile.id, {httpOnly: true, sameSite: 'strict', secure: true});
                    res.redirect('/');
                });

        });
    }
};

spotifyAuthorizationClient.refresh = async (req, res) => {
    let userId = req.cookies[CONSTANTS.SPOTIFY_USER_ID];
    if(!userId) {
        console.log('no userId in cookies, user must log in');
        return res.send({isLoggedIn: false});
    }

    const refreshToken = await redisClient.getRefreshToken(userId);
    const options = {
        url: 'https://accounts.spotify.com/api/token',
        form: {
            grant_type: "refresh_token",
            client_id: CLIENT_ID,
            refresh_token: refreshToken
        },
        headers: {
            'Authorization': 'Basic ' + (new Buffer(CLIENT_ID + ':' + CLIENT_SECRET).toString('base64'))
        }
    };

    return request.post(options, (error, response, body) => {
        let jsonBody = JSON.parse(body);
        if(jsonBody.error) {
            return res.send({isLoggedIn: false, jsonBody});
        }
        const accessToken = jsonBody.access_token;

        return spotifyApiClient.me()(req, res)
            .then(profile => {
                redisClient.setAccessToken(profile.id, accessToken);
                redisClient.setRefreshToken(profile.id, refreshToken);
                console.log(accessToken);
                res.send({isLoggedIn: true, profile, accessToken})
            });
    });
}

spotifyAuthorizationClient.logout = (req, res) => {
    let userId = req.cookies[CONSTANTS.SPOTIFY_USER_ID];
    if (!userId) {
        console.log('already logged out');
        return res.send({isLoggedIn: false});
    }

    redisClient.deleteAccessToken(userId);
    redisClient.deleteRefreshToken(userId);
    res.clearCookie(CONSTANTS.SPOTIFY_USER_ID);
    return res.send({isLoggedIn: false});
}

export default spotifyAuthorizationClient;
