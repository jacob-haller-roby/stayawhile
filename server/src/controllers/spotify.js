import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import spotifyClient from "../clients/spotifyClient";
const spotify = express();

spotify.use(cors()).use(cookieParser());

spotify.get('/', (req, res) => {
    return res.send('hit spotify sub controller');
});

spotify.get('/login', spotifyClient.login);
spotify.get('/callback', spotifyClient.loginCallback);
spotify.get('/refresh', spotifyClient.refresh);
spotify.get('/logout', spotifyClient.logout);

export default spotify;