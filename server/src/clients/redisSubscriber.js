import logger from "../util/logger";
import redisClient from "./redisClient";
import redisKeys from "../util/redisKeys";
import spotifyApiClient from "./spotifyApiClient";

const redisSubscriberClient = redisClient.duplicate();
const subscriberPattern = '*' + redisKeys.currentTrack('*');
logger.debug("Subscriber pattern: " + subscriberPattern);

redisSubscriberClient.psubscribe(subscriberPattern);

redisSubscriberClient.on('pmessage', async (pattern, channel, message) =>{
    const roomId = channel.split(':')[2];
    logger.debug(pattern, channel, message);
    if (message === 'hset') {
        logger.debug('Room ' + roomId + ' has changed songs');
        const room = await redisClient.getRoom(roomId);
        const track = await redisClient.getCurrentTrack(roomId);
        await Promise.all(room.attendees.map(async userId => {
            if (userId === room.owner) return;
            const accessToken = await redisClient.getAccessToken(userId);
            const deviceId = await redisClient.getDeviceId(userId);
            logger.debug('changing song for user ' + userId + ' to ' + track.uri);
            return spotifyApiClient.playTrack(track.uri, deviceId)(null, accessToken)
        }));
    }
});

export default redisSubscriberClient;