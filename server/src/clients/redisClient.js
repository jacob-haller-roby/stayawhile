import unpromisedRedis from 'redis';
import promisifyRedis from 'promisify-redis';
import logger from "../util/logger";

const redis = promisifyRedis(unpromisedRedis);
const redisClient = redis.createClient({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT
});

redisClient.convertJsonToHashArray = (json) => {
    return Object.entries(json).flat();
};

redisClient.smembersa = async (...args) => {
    let members = await redisClient.smembers(...args);
    return Array.isArray(members) ? members : [members];
};

const keys = {
    accessTokenKey: (refreshToken) => `access_token:${refreshToken}`, //string
    userId: (refreshToken) => `user_id:${refreshToken}`, //string
    roomIdCounter: () => `room_id_counter`, //string
    roomId: (roomId) => `room:${roomId}`, //hash
    userRooms: (userId) => `user_rooms:${userId}`, //set
    userCurrentRoom: (userId) => `user_current_room:${userId}`, //string
    roomAttendees: (roomId) => `room_attendees:${roomId}` //set
}

//Access Tokens
redisClient.setAccessToken = (refreshToken, accessToken) => redisClient.set(keys.accessTokenKey(refreshToken), accessToken);
redisClient.getAccessToken = (refreshToken) => redisClient.get(keys.accessTokenKey(refreshToken));
redisClient.deleteAccessToken = (refreshToken) => redisClient.del(keys.accessTokenKey(refreshToken));

//User Ids
redisClient.setUserId = (refreshToken, userId) => redisClient.set(keys.userId(refreshToken), userId);
redisClient.getUserId = (refreshToken) => redisClient.get(keys.userId(refreshToken));
redisClient.deleteUserId = (refreshToken) => redisClient.del(keys.userId(refreshToken));

//Rooms
redisClient.getRoom = async (roomId) => ({
    ...await redisClient.hgetall(keys.roomId(roomId)),
    attendees: await redisClient.smembersa(keys.roomAttendees(roomId))
});
redisClient.joinRoom = async (roomId, userId) => {
    await redisClient.sadd(keys.userRooms(userId), roomId);
};
redisClient.leaveRoom = async (roomId, userId) => {
    await redisClient.srem(keys.userRooms(userId), roomId);
};
redisClient.attendRoom = async (roomId, userId) => {
    await redisClient.set(keys.userCurrentRoom(userId), roomId);
    await redisClient.sadd(keys.roomAttendees(roomId), userId);
}
redisClient.departRoom = async (userId) => {
    const currentRoomId = await redisClient.get(keys.userCurrentRoom(userId));
    if (currentRoomId) {
        await redisClient.srem(keys.roomAttendees(currentRoomId), userId);
        await redisClient.del(keys.userCurrentRoom(userId));
    }
}
redisClient.addRoom = async (ownerId, options) => {
    await redisClient.setnx(keys.roomIdCounter(), 0);
    await redisClient.incr(keys.roomIdCounter());
    const roomId = await redisClient.get(keys.roomIdCounter());
    redisClient.sadd(keys.userRooms(ownerId), roomId);

    await redisClient.hmset(keys.roomId(roomId), ...await redisClient.convertJsonToHashArray({id: roomId, owner: ownerId, ...options}));
    redisClient.joinRoom(roomId, ownerId);
    return await redisClient.getRoom(roomId);
};
redisClient.getRoomsByUser = async (userId) => {
    const roomIds = await redisClient.smembersa(keys.userRooms(userId));
    return await Promise.all(roomIds.map(redisClient.getRoom));
};
redisClient.deleteRoom = async (roomId) => {
    redisClient.del(keys.roomId(roomId));
    redisClient.smembersa(keys.roomAttendees(roomId)).then(members => members.map(userId => redisClient.leaveRoom(roomId, userId)));
    redisClient.del(keys.roomAttendees(roomId));
};
redisClient.getAllRooms = async () => {
    const roomCount = await redisClient.get(keys.roomIdCounter());
    const roomIds = [...Array(parseInt(roomCount)).keys()].map(i => (i+1).toString());
    return await Promise.all(roomIds.map(redisClient.getRoom)).catch(logger.error);
}


export default redisClient;