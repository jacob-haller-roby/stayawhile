import WebSocket from 'ws';
import logger from "../util/logger";

const webSocketClient = {};

webSocketClient.connectionMap = {};

webSocketClient.init = (server) => {
    webSocketClient.server = new WebSocket.Server({server});
    webSocketClient.server.on('connection', (socket, req) => {

        logger.log('connecting... ' + req.url);
        const userId = req.url.replace('/','');

        delete webSocketClient.connectionMap[userId];
        webSocketClient.connectionMap[userId] = socket;

        socket.on('message', message => {
            logger.debug(`websocket message received for user: ${userId}, message: ${message}`);
            socket.send(JSON.stringify({connectionResponse: `Message received: ${message}`}));
        });
    })
};

webSocketClient.sendToUser = (userId, type, message) => {
    const socket = webSocketClient.connectionMap[userId];
    if (!socket) {
        return logger.error(`Cannot send websocket message to ${userId}. No connection stored.`)
    }
    socket.send(JSON.stringify({
        type,
        message
    }));
}

export default webSocketClient;

