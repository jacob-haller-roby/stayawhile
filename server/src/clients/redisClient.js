import unpromisedRedis from 'redis';
import promisifyRedis from 'promisify-redis';

const redis = promisifyRedis(unpromisedRedis);
const redisClient = redis.createClient({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT
});

const keys = {
    accessTokenKey: (refreshToken) => `access_token:${refreshToken}`
}

redisClient.setAccessToken = (refreshToken, accessToken) => redisClient.set(keys.accessTokenKey(refreshToken), accessToken);
redisClient.getAccessToken = (refreshToken) => redisClient.get(keys.accessTokenKey(refreshToken));
redisClient.deleteAccessToken = (refreshToken) => redisClient.del(keys.accessTokenKey(refreshToken));

export default redisClient;