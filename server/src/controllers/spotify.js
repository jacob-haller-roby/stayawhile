import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import spotifyAuthorizationClient from "../clients/spotifyAuthorizationClient";
import spotifyApiClient from "../clients/spotifyApiClient";
import Authenticated from "../middleware/Authenticated";
const spotify = express();

spotify.use(cors()).use(cookieParser());

spotify.get('/', (req, res) => {
    return res.send('hit spotify sub controller');
});

// Authorization Endpoints
spotify.get('/login', spotifyAuthorizationClient.login);
spotify.get('/callback', spotifyAuthorizationClient.loginCallback);
spotify.get('/refresh', spotifyAuthorizationClient.refresh);
spotify.get('/logout', spotifyAuthorizationClient.logout);

// API endpoints, userId added to res.locals
spotify.use(Authenticated);
spotify.get('/me', async (req, res) => res.send(await spotifyApiClient.me(req, res)));



export default spotify;