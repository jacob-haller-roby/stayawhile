import 'source-map-support/register';
import express from 'express';
import path from 'path';
import spotify from "./controllers/spotify";
import logger from "./util/logger";
import room from "./controllers/room";
import Authenticated from "./middleware/Authenticated";
import cookieParser from 'cookie-parser';
import webSocketClient from "./clients/websocketClient";
import redisSubscriberClient from "./clients/redisSubscriberClient";
import redisClient from "./clients/redisClient";
import spotifyApiClient from "./clients/spotifyApiClient";
import spotifyAuthorizationClient from "./clients/spotifyAuthorizationClient";

logger.debug(process.env);
const app = express();

app.use((req, res, next) => {
    logger.log((new Date()).toISOString(), req.path);
    next();
});
app.use(express.static(path.join(__dirname, 'build')));

app.get('/gameOn/:roomId', (req, res) => {
    res.cookie("inviteRoomId", req.params.roomId);
    res.redirect(301, '/');
});

app.use('/spotify', spotify);
app.use('/room', room);

app.use(cookieParser())
app.use(Authenticated);
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});


const server = app.listen(process.env.SERVER_PORT, '0.0.0.0');

logger.debug('Init websocketClient');
webSocketClient.init(server, redisClient);
logger.debug('Init spotifyApiClient');
spotifyApiClient.init(redisClient);
logger.debug('Init redisSubscriberClient');
redisSubscriberClient.init(redisClient, webSocketClient, spotifyApiClient);
logger.debug('Init spotifyAuthorizationClient');
spotifyAuthorizationClient.init(redisClient, spotifyApiClient);
