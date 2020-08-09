import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import spotifyAuthorizationClient from "../clients/spotifyAuthorizationClient";
import spotifyApiClient from "../clients/spotifyApiClient";
import Authenticated from "../middleware/Authenticated";
import redisClient from "../clients/redisClient";
import bodyParser from 'body-parser';
import logger from "../util/logger";

const spotify = express();

spotify.use(cors()).use(cookieParser()).use(bodyParser.json());

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
spotify.get('/me', async (req, res) => res.send(await spotifyApiClient.me()(req, res)));
spotify.get('/playlists', async (req, res) => res.send(await spotifyApiClient.playlists(req, res)));
spotify.get('/playlists/suggested', async (req, res) => res.send(await spotifyApiClient.suggestedPlaylists(req, res)));
spotify.put('/register/:deviceId', async (req, res) => res.send(await redisClient.saveDeviceId(res.locals.userId, req.params.deviceId)));
spotify.put('/play/:playlistId', async (req, res) => {
    const deviceId = await redisClient.getDeviceId(res.locals.userId);
    const playlistUri = (await redisClient.getPlaylist(req.params.playlistId)).uri;

    await spotifyApiClient.play(playlistUri, deviceId)(req, res);
    await spotifyApiClient.shuffle()(req, res);
    await spotifyApiClient.repeat()(req, res);

    res.send({status: "Playing"})
});
spotify.put('/currentTrack', async (req, res) => {
    await redisClient.saveCurrentTrack(req.body.roomId, req.body.currentTrack);
    res.send({status: "Playing"});
});


export default spotify;