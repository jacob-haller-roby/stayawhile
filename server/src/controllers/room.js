import express from 'express';
import redisClient from "../clients/redisClient";
import Authenticated from "../middleware/Authenticated";
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import passwordHash from 'password-hash';
import errorResponseFactory from "../util/errorResponseFactory";
import logger from "../util/logger";
import CONSTANTS from "../constants";

const room = express().use(cookieParser()).use(bodyParser.json());

room.use(Authenticated);
const getUserId = (req) => req.cookies[CONSTANTS.SPOTIFY_USER_ID];
room.post('/create', async (req, res) => {
    if(req.body.password) {
        const password = passwordHash.generate(req.body.password);
        await res.send(await redisClient.addRoom(getUserId(req), {...req.body, password}));
    } else {
        await res.send(await redisClient.addRoom(getUserId(req), {...req.body}));
    }

});
room.post('/membership/:roomId', async (req, res) => {
    const room = await redisClient.getRoom(req.params.roomId);
    if (!room.password || passwordHash.verify(req.body.password || '', room.password)){
        await redisClient.joinRoom(req.params.roomId, getUserId(req));
        res.send(await redisClient.getRoomsByUser(getUserId(req)));
    } else {
        errorResponseFactory.create403(res, "Incorrect Password");
    }
});
room.delete('/membership/:roomId', async (req, res) => {
    await redisClient.leaveRoom(req.params.roomId, getUserId(req));
    await res.send(await redisClient.getRoomsByUser(getUserId(req)));
});
room.get('/membership', async (req, res) => res.send(await redisClient.getRoomsByUser(getUserId(req))));
//room.get('/', async (req, res) => res.send(await redisClient.getAllRooms()));
room.post('/attend/:roomId', async (req, res) => {
    await redisClient.departRoom(getUserId(req));
    await redisClient.attendRoom(req.params.roomId, getUserId(req));
    res.send(await redisClient.getRoomsByUser(getUserId(req)));
});
room.delete('/attend', async (req, res) => {
    await redisClient.departRoom(getUserId(req));
    res.send(await redisClient.getRoomsByUser(getUserId(req)));
});

room.post('/playlists/:roomId', async (req, res) => {
    res.send(await redisClient.saveRoomPlaylists(req.params.roomId, getUserId(req), req.body.playlists));
})
room.get('/playlists/:roomId', async (req, res) => res.send(await redisClient.getRoomPlaylists(req.params.roomId)));
room.put('/playlists/:roomId/phrases/:playlistId', async (req, res) => res.send(await redisClient.setPlaylistPhrase(req.params.roomId, req.params.playlistId, req.body.phrases)));
export default room;