import logger from "../util/logger";
import redisKeys from "../util/redisKeys";

const redisSubscriberClient = {
    subscriptions: [
        {
            pattern: '*' + redisKeys.currentTrack('*'),
            callback: async (pattern, channel, message) => {
                if (message === 'hset') {
                    const roomId = channel.split(':')[2];
                    logger.debug(`PUBSUB: Track changed for room ${roomId}`);
                    const room = await redisSubscriberClient.redisClient.getRoom(roomId);
                    const track = await redisSubscriberClient.redisClient.getCurrentTrack(roomId);
                    await Promise.all(room.attendees.map(async userId => {
                        if (userId === room.owner) return;
                        const accessToken = await redisSubscriberClient.redisClient.getAccessToken(userId);
                        const deviceId = await redisSubscriberClient.redisClient.getDeviceId(userId);
                        logger.debug('changing song for user ' + userId + ' to ' + track.uri);
                        return redisSubscriberClient.spotifyApiClient.playTrack(track.uri, deviceId)(null, accessToken)
                    }));
                }
            }
        },
        {
            pattern: '*' + redisKeys.roomAttendees('*'),
            callback: async (pattern, channel, message) => {
                if (message === 'srem' || message === 'sadd') {
                    const roomId = channel.split(':')[2];
                    logger.debug(`PUBSUB: Attendees changed for room ${roomId}`);
                    const attendees = await redisSubscriberClient.redisClient.getRoomAttendeeIds(roomId);
                    attendees.forEach(attendeeId => redisSubscriberClient.websocketClient.sendToUser(attendeeId, "ROOM_ATTENDEES", {roomId, attendees}));
                }
            }
        }
    ],
    subscribers: []
};

redisSubscriberClient.init = (redisClient, websocketClient, spotifyApiClient) => {
    redisSubscriberClient.websocketClient = websocketClient;
    redisSubscriberClient.redisClient = redisClient;
    redisClient.spotifyApiClient = spotifyApiClient;
    redisSubscriberClient.subscriptions.forEach(options => {
        const {pattern, callback} = options;
        logger.debug(`Registering redis subscription.  Pattern: ${pattern}, Callback Exists: ${typeof callback === 'function'}`);
        const redisSubscriber = redisSubscriberClient.redisClient.duplicate();
        redisSubscriber.psubscribe(pattern);
        redisSubscriber.on('pmessage', callback);
        redisSubscriberClient.subscribers.push(redisSubscriber);
    });
}

export default redisSubscriberClient;