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
    roomAttendees: (roomId) => `room_attendees:${roomId}`, //set
    roomPlaylists: (roomId) => `room_playlists:${roomId}`, //set
    playlist: (playlistId) => `playlist:${playlistId}` //hash
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
    await redisClient.smembersa(keys.userRooms(userId))
        .then(async roomIds => await Promise.all(roomIds.map(roomId => redisClient.srem(keys.roomAttendees(roomId), userId))));
    await redisClient.del(keys.userCurrentRoom(userId));
}
redisClient.addRoom = async (ownerId, options) => {
    await redisClient.setnx(keys.roomIdCounter(), 0);
    await redisClient.incr(keys.roomIdCounter());
    const roomId = await redisClient.get(keys.roomIdCounter());
    redisClient.sadd(keys.userRooms(ownerId), roomId);

    await redisClient.hmset(keys.roomId(roomId), ...await redisClient.convertJsonToHashArray({
        id: roomId,
        owner: ownerId, ...options
    }));
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
    const roomIds = [...Array(parseInt(roomCount)).keys()].map(i => (i + 1).toString());
    return await Promise.all(roomIds.map(redisClient.getRoom)).catch(logger.error);
};
redisClient.saveRoomPlaylists = async (roomId, ownerId, playlists) => {
    const roomOwnerId = await redisClient.hget(keys.roomId(roomId), 'owner');
    if (roomOwnerId !== ownerId) throw Error('Only owner can modify playlists');

    await redisClient.del(keys.roomPlaylists(roomId));
    await Promise.all(playlists.map(async playlist => {
        const redisPlaylist = {
            name: playlist.name,
            imageUrl: playlist.images.length && playlist.images[0].url,
            href: playlist.href, //"https://api.spotify.com/v1/playlists/${id}"
            uri: playlist.uri, //"spotify:playlist:${id}"
            id: playlist.id
        };
        redisClient.hmset(keys.playlist(playlist.id), ...await redisClient.convertJsonToHashArray(redisPlaylist));
        redisClient.sadd(keys.roomPlaylists(roomId), playlist.id);
    }));
    return await redisClient.getRoomPlaylists(roomId);
}
redisClient.getRoomPlaylists = async (roomId) => {
    return await Promise.all(
        (await redisClient.smembersa(keys.roomPlaylists(roomId)))
            .map(async playlistId => await redisClient.getPlaylist(playlistId))
    );
};
redisClient.getPlaylist = async (playlistId) => {
    return await redisClient.hgetall(keys.playlist(playlistId));
}


export default redisClient;