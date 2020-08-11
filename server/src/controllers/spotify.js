import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import spotifyAuthorizationClient from "../clients/spotifyAuthorizationClient";
import spotifyApiClient from "../clients/spotifyApiClient";
import Authenticated from "../middleware/Authenticated";
import redisClient from "../clients/redisClient";
import bodyParser from 'body-parser';
import logger from "../util/logger";
import CONSTANTS from "../constants";
import errorResponseFactory from "../util/errorResponseFactory";

const spotify = express();

spotify.use(cors()).use(cookieParser()).use(bodyParser.json());

spotify.get('/', (req, res) => {
    return res.send('hit spotify sub controller');
});

// Authorization Endpoints
spotify.get('/login', spotifyAuthorizationClient.login);
spotify.get('/callback', spotifyAuthorizationClient.loginCallback);
spotify.get('/refresh', async (req, res) => {
    return await spotifyAuthorizationClient.refresh(req, res);
});
spotify.get('/logout', spotifyAuthorizationClient.logout);

// API endpoints, userId added to res.locals
spotify.use(Authenticated);
const getUserId = (req) => req.cookies[CONSTANTS.SPOTIFY_USER_ID];
spotify.get('/me', async (req, res) => res.send(await spotifyApiClient.me()(getUserId(req))));
spotify.get('/playlists', async (req, res) => res.send(await spotifyApiClient.playlists()(getUserId(req))));
spotify.get('/playlists/suggested', async (req, res) => res.send(await spotifyApiClient.suggestedPlaylists()(getUserId(req))));
spotify.put('/register/:deviceId', async (req, res) => {
    // Use John Cage 4:33 to quietly initialize the web player.  :)
    await spotifyApiClient.playTrack('spotify:track:2bNCdW4rLnCTzgqUXTTDO1', req.params.deviceId)(getUserId(req));
    res.send({deviceId: await redisClient.saveDeviceId(getUserId(req), req.params.deviceId)})
});
spotify.put('/play/:playlistId', async (req, res) => {
    const userId = getUserId(req);
    const deviceId = await redisClient.getDeviceId(userId);
    const playlist = await redisClient.getPlaylist(req.params.playlistId);

    let status = await spotifyApiClient.getStatus()(userId);

    const shuffle = true;
    if (status.shuffle_state !== shuffle) {
        logger.debug('setting shuffle state')
        await spotifyApiClient.shuffle(shuffle)(userId);
    }
    await spotifyApiClient.play(playlist.uri, deviceId)(userId);
    const repeat = 'context';
    if (status.repeat_state !== repeat) {
        logger.debug('setting repeat state');
        await spotifyApiClient.repeat(repeat)(userId);
    }

    res.send({status: "Playing"})
});
spotify.put('/currentTrack', async (req, res) => {
    const room = await redisClient.getRoom(req.body.roomId);
    if (getUserId(req) === room.owner) {
        await redisClient.saveCurrentTrack(req.body.roomId, req.body.currentTrack);
        return res.send({status: "Playing"});
    } else {
        return errorResponseFactory.create403(req, res, "Only the room owner may change the room's track");
    }
});
spotify.post('/next', async (req, res) => res.send(await spotifyApiClient.next()(getUserId(req))));
spotify.post('/previous', async (req, res) => res.send(await spotifyApiClient.previous()(getUserId(req))));
spotify.post('/pauseOrPlay', async (req, res) => {
    const status = await spotifyApiClient.getStatus()(getUserId(req));
    if (status.is_playing) {
        logger.debug('pausing');
        await spotifyApiClient.pause()(getUserId(req));
        res.send({status: 'Paused'});
    } else {
        logger.debug('playing');
        await spotifyApiClient.play()(getUserId(req));
        res.send({status: 'Playing'});
    }
});

export default spotify;