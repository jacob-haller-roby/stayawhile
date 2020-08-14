import unpromisedRedis from 'redis';
import promisifyRedis from 'promisify-redis';
import logger from "../util/logger";
import redisKeys from "../util/redisKeys";

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

//Access Tokens
redisClient.setAccessToken = (userId, accessToken, expire) => {
    redisClient.set(redisKeys.accessTokenKey(userId), accessToken);
    redisClient.expire(redisKeys.accessTokenKey(userId), expire);
    return redisClient.getAccessToken(redisKeys.accessTokenKey(userId));
}
redisClient.getAccessToken = (userId) => redisClient.get(redisKeys.accessTokenKey(userId));
redisClient.deleteAccessToken = (userId) => redisClient.del(redisKeys.accessTokenKey(userId));

//Refresh Token
redisClient.setRefreshToken = (userId, refreshToken) => redisClient.set(redisKeys.refreshToken(userId), refreshToken);
redisClient.getRefreshToken = (userId) => redisClient.get(redisKeys.refreshToken(userId));
redisClient.deleteRefreshToken = (userId) => redisClient.del(redisKeys.refreshToken(userId));

//Rooms
redisClient.getRoom = async (roomId) => ({
    ...await redisClient.hgetall(redisKeys.roomId(roomId)),
    attendees: await redisClient.smembersa(redisKeys.roomAttendees(roomId))
});
redisClient.joinRoom = async (roomId, userId) => {
    await redisClient.sadd(redisKeys.userRooms(userId), roomId);
};
redisClient.leaveRoom = async (roomId, userId) => {
    await redisClient.srem(redisKeys.userRooms(userId), roomId);
};
redisClient.attendRoom = async (roomId, userId) => {
    await redisClient.set(redisKeys.userCurrentRoom(userId), roomId);
    await redisClient.sadd(redisKeys.roomAttendees(roomId), userId);
}
redisClient.departRoom = async (userId) => {
    await redisClient.smembersa(redisKeys.userRooms(userId))
        .then(async roomIds => await Promise.all(roomIds.map(roomId => redisClient.srem(redisKeys.roomAttendees(roomId), userId))));
    await redisClient.del(redisKeys.userCurrentRoom(userId));
}
redisClient.addRoom = async (ownerId, options) => {
    await redisClient.setnx(redisKeys.roomIdCounter(), 0);
    await redisClient.incr(redisKeys.roomIdCounter());
    const roomId = await redisClient.get(redisKeys.roomIdCounter());
    redisClient.sadd(redisKeys.userRooms(ownerId), roomId);

    await redisClient.hmset(redisKeys.roomId(roomId), ...await redisClient.convertJsonToHashArray({
        id: roomId,
        owner: ownerId, ...options
    }));
    redisClient.joinRoom(roomId, ownerId);
    return await redisClient.getRoom(roomId);
};
redisClient.getRoomsByUser = async (userId) => {
    const roomIds = await redisClient.smembersa(redisKeys.userRooms(userId));
    return await Promise.all(roomIds.map(redisClient.getRoom));
};
redisClient.deleteRoom = async (roomId) => {
    redisClient.del(redisKeys.roomId(roomId));
    redisClient.smembersa(redisKeys.roomAttendees(roomId)).then(members => members.map(userId => redisClient.leaveRoom(roomId, userId)));
    redisClient.del(redisKeys.roomAttendees(roomId));
};
redisClient.getAllRooms = async () => {
    const roomCount = await redisClient.get(redisKeys.roomIdCounter());
    const roomIds = [...Array(parseInt(roomCount)).keys()].map(i => (i + 1).toString());
    return await Promise.all(roomIds.map(redisClient.getRoom)).catch(logger.error);
};
redisClient.saveRoomPlaylists = async (roomId, ownerId, playlists) => {
    const roomOwnerId = await redisClient.hget(redisKeys.roomId(roomId), 'owner');
    if (roomOwnerId !== ownerId) throw Error('Only owner can modify playlists');

    await redisClient.del(redisKeys.roomPlaylists(roomId));
    await Promise.all(playlists.map(async playlist => {
        const redisPlaylist = {
            name: playlist.name,
            imageUrl: playlist.images.length && playlist.images[0].url,
            href: playlist.href, //"https://api.spotify.com/v1/playlists/${id}"
            uri: playlist.uri, //"spotify:playlist:${id}"
            id: playlist.id
        };
        redisClient.hmset(redisKeys.playlist(playlist.id), ...await redisClient.convertJsonToHashArray(redisPlaylist));
        redisClient.sadd(redisKeys.roomPlaylists(roomId), playlist.id);
    }));
    return await redisClient.getRoomPlaylists(roomId);
}
redisClient.getRoomPlaylists = async (roomId) => {
    return await Promise.all(
        (await redisClient.smembersa(redisKeys.roomPlaylists(roomId)))
            .map(async playlistId => await redisClient.getPlaylist(playlistId, roomId))
    );
};
redisClient.getPlaylist = async (playlistId, roomId) => {
    return {
        ...await redisClient.hgetall(redisKeys.playlist(playlistId)),
        phrases: roomId && await redisClient.getPlaylistPhrases(roomId, playlistId)
    };
};
redisClient.saveDeviceId = async (userId, deviceId) => {
    await redisClient.set(redisKeys.device(userId), deviceId);
    return await redisClient.getDeviceId(userId);
};
redisClient.getDeviceId = async (userId) => {
    return await redisClient.get(redisKeys.device(userId));
};
redisClient.saveCurrentTrack = async (roomId, currentTrack) => {
    const redisTrack = {
        imageUrl: currentTrack.album.images[0].url,
        artist: currentTrack.artists.map(artist => artist.name).join(' & '),
        uri: currentTrack.uri
    }
    redisClient.hmset(redisKeys.currentTrack(roomId), ...await redisClient.convertJsonToHashArray(redisTrack));
    return await redisClient.getCurrentTrack(roomId);
};
redisClient.getCurrentTrack = async (roomId) => {
    return await redisClient.hgetall(redisKeys.currentTrack(roomId))
};
redisClient.setPlaylistPhrase = async (roomId, playlistId, phraseArray) => {
    await redisClient.del(redisKeys.roomPlaylistPhrases(roomId, playlistId));
    if (!!phraseArray && phraseArray.length) {
        await redisClient.sadd(redisKeys.roomPlaylistPhrases(roomId, playlistId), phraseArray);
    }
    return await redisClient.getPlaylistPhrases(roomId, playlistId);
};
redisClient.getPlaylistPhrases = async (roomId, playlistId) => {
    return await redisClient.smembersa(redisKeys.roomPlaylistPhrases(roomId, playlistId));
}


export default redisClient;