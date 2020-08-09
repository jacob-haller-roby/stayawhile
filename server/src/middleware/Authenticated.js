import CONSTANTS from "../constants";
import errorResponseFactory from "../util/errorResponseFactory";
import redisClient from "../clients/redisClient";

export default async (req, res, next) => {
    const userId = req.cookies[CONSTANTS.SPOTIFY_USER_ID];
    const refreshToken = req.cookies[CONSTANTS.SPOTIFY_REFRESH_TOKEN];

    if (!userId || !refreshToken) {
        return errorResponseFactory.create401(res, "No login detected");
    }

    if (await redisClient.getRefreshToken(userId) !== refreshToken) {
        return errorResponseFactory.create401(res, "Invalid Login");
    };
    next();
};