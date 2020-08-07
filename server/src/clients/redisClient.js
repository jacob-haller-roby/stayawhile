import unpromisedRedis from 'redis';
import promisifyRedis from 'promisify-redis';

const redis = promisifyRedis(unpromisedRedis);
const redisClient = redis.createClient({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT
});

redisClient.convertJsonToHashArray = (json) => {
    return Object.entries(json).flat();
}

redisClient.smembersa = async (...args) => {
    let members = await redisClient.smembers(...args);
    return Array.isArray(members) ? members : [members];
}

const keys = {
    accessTokenKey: (refreshToken) => `access_token:${refreshToken}`, //string
    userId: (refreshToken) => `user_id:${refreshToken}`, //string
    roomIdCounter: () => `room_id_counter`, //string
    roomId: (roomId) => `room:${roomId}`, //hash
    userRooms: (userId) => `user_rooms:${userId}`, //set
    roomParticipants: (roomId) => `room_participants:${roomId}` //set
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
    participants: await redisClient.smembersa(keys.roomParticipants(roomId))
});
redisClient.joinRoom = async (roomId, userId) => {
    await redisClient.sadd(keys.userRooms(userId), roomId);
    await redisClient.sadd(keys.roomParticipants(roomId), userId);
};
redisClient.leaveRoom = async (roomId, userId) => {
    await redisClient.srem(keys.userRooms(userId), roomId);
    await redisClient.srem(keys.roomParticipants(roomId), userId);
};
redisClient.addRoom = async (ownerId, password) => {
    await redisClient.setnx(keys.roomIdCounter(), 0);
    await redisClient.incr(keys.roomIdCounter());
    const roomId = await redisClient.get(keys.roomIdCounter());
    redisClient.sadd(keys.userRooms(ownerId), roomId);

    await redisClient.hmset(keys.roomId(roomId), ...await redisClient.convertJsonToHashArray({id: roomId, owner: ownerId, password: password}));
    redisClient.joinRoom(roomId, ownerId);
    return await redisClient.getRoom(roomId);
};
redisClient.getRoomsByUser = async (userId) => {
    const roomIds = await redisClient.smembersa(keys.userRooms(userId));
    return await Promise.all(roomIds.map(async roomId => await redisClient.getRoom(roomId)));
};
redisClient.deleteRoom = async (roomId) => {
    redisClient.del(keys.roomId(roomId));
    redisClient.smembersa(keys.roomParticipants(roomId)).then(members => members.map(userId => redisClient.leaveRoom(roomId, userId)));
    redisClient.del(keys.roomParticipants(roomId));
}


export default redisClient;