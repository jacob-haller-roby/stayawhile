import redisClient from "../clients/redisClient";
import CONSTANTS from "../constants";
import errorResponseFactory from "../util/errorResponseFactory";

export default async (req, res, next) => {
    res.locals.userId = req.cookies[CONSTANTS.SPOTIFY_USER_ID];

    if (!res.locals.userId) {
        return errorResponseFactory.create401(res, "No Login Detected");
    }
    next();
};