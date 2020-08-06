import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import spotifyAuthorizationClient from "../clients/spotifyAuthorizationClient";
import spotifyApiClient from "../clients/spotifyApiClient";
const spotify = express();

spotify.use(cors()).use(cookieParser());

spotify.get('/', (req, res) => {
    return res.send('hit spotify sub controller');
});

spotify.get('/login', spotifyAuthorizationClient.login);
spotify.get('/callback', spotifyAuthorizationClient.loginCallback);
spotify.get('/refresh', spotifyAuthorizationClient.refresh);
spotify.get('/logout', spotifyAuthorizationClient.logout);

spotify.get('/me', async (req, res) => {
    res.send(await spotifyApiClient.me(req, res));
});

export default spotify;