import CONSTANTS from "../constants";
import errorResponseFactory from "../util/errorResponseFactory";
import redisClient from "../clients/redisClient";
import spotifyAuthorizationClient from "../clients/spotifyAuthorizationClient";

export default async (req, res, next) => {
    const userId = req.cookies[CONSTANTS.SPOTIFY_USER_ID];
    const refreshToken = req.cookies[CONSTANTS.SPOTIFY_REFRESH_TOKEN];

    if (!userId || !refreshToken) {
        return errorResponseFactory.create401(req, res, "No login detected");
    }

    if (await redisClient.getRefreshToken(userId) !== refreshToken) {
        return errorResponseFactory.create401(req, res, "Invalid Login");
    }
    if (!(await redisClient.getAccessToken(userId))) {
        await spotifyAuthorizationClient.refresh(req, res);
    }
    next();
};