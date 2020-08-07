import express from 'express';
import redisClient from "../clients/redisClient";
import Authenticated from "../middleware/Authenticated";
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import passwordHash from 'password-hash';
import errorResponseFactory from "../util/errorResponseFactory";
import logger from "../util/logger";

const room = express().use(cookieParser()).use(bodyParser.json());

room.use(Authenticated);
room.post('/create', async (req, res) => {
    if(req.body.password) {
        const password = passwordHash.generate(req.body.password);
        await res.send(await redisClient.addRoom(res.locals.userId, {...req.body, password}));
    } else {
        await res.send(await redisClient.addRoom(res.locals.userId, {...req.body}));
    }

});
room.post('/membership/:roomId', async (req, res) => {
    const room = await redisClient.getRoom(req.params.roomId);
    if (!room.password || passwordHash.verify(req.body.password || '', room.password)){
        await redisClient.joinRoom(req.params.roomId, res.locals.userId);
        await res.send(redisClient.getRoomsByUser(res.locals.userId));
    } else {
        errorResponseFactory.create403(res, "Incorrect Password");
    }
});
room.delete('/membership/:roomId', async (req, res) => {
    await redisClient.leaveRoom(req.params.roomId, res.locals.userId);
    await res.send(await redisClient.getRoomsByUser(res.locals.userId));
});
room.get('/membership', async (req, res) => res.send(await redisClient.getRoomsByUser(res.locals.userId)));
//room.get('/', async (req, res) => res.send(await redisClient.getAllRooms()));
room.post('/attend/:roomId', async (req, res) => {
    await redisClient.attendRoom(req.params.roomId, res.locals.userId);
    res.send(await redisClient.getRoomsByUser(res.locals.userId));
});
room.delete('/attend', async (req, res) => {
    await redisClient.departRoom(res.locals.userId);
    res.send(await redisClient.getRoomsByUser(res.locals.userId));
});
export default room;