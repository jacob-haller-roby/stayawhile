import queryString from 'query-string';
import redisClient from "./redisClient";
import request from 'request';
import CONSTANTS from '../constants';

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
                    scope: 'user-read-private user-read-email',
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
            if (!error && response.statusCode === 200) {

                const access_token = body.access_token,
                    refresh_token = body.refresh_token;

                res.cookie(CONSTANTS.SPOTIFY_REFRESH_TOKEN, refresh_token, {httpOnly: true, sameSite: 'strict', secure: true});
                redisClient.setAccessToken(refresh_token, access_token);
                // const options = {
                //     url: 'https://api.spotify.com/v1/me',
                //     headers: { 'Authorization': 'Bearer ' + access_token },
                //     json: true
                // };
                //
                // // use the access token to access the Spotify Web API
                // request.get(options, function(error, response, body) {
                //     console.log(body);
                // });
            } else {
                console.error('ERROR: ' + error);
            }
            res.redirect('/');
        });
    }
};

spotifyAuthorizationClient.refresh = (req, res) => {
    let refresh_token = req.cookies[CONSTANTS.SPOTIFY_REFRESH_TOKEN];
    if(!refresh_token) {
        console.log('no refresh token, user must log in');
        return res.send({isLoggedIn: false});
    }

    const options = {
        url: 'https://accounts.spotify.com/api/token',
        form: {
            grant_type: "refresh_token",
            client_id: CLIENT_ID,
            refresh_token: refresh_token
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
        redisClient.setAccessToken(refresh_token, jsonBody.access_token);
        return res.send({isLoggedIn: true})
    });
}

spotifyAuthorizationClient.logout = (req, res) => {
    let refresh_token = req.cookies[CONSTANTS.SPOTIFY_REFRESH_TOKEN];
    if (!refresh_token) {
        console.log('already logged out');
        return res.send({isLoggedIn: false});
    }

    redisClient.deleteAccessToken(refresh_token);
    res.clearCookie(CONSTANTS.SPOTIFY_REFRESH_TOKEN);
    return res.send({isLoggedIn: false});
}

export default spotifyAuthorizationClient;
