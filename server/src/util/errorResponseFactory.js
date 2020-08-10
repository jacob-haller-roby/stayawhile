import CONSTANTS from "../constants";

const errorResponseFactory = {};

errorResponseFactory.create = (errorMessage) => ({errorMessage});
errorResponseFactory.create401 = (req, res, errorMessage) => {
    res.clearCookie(CONSTANTS.SPOTIFY_REFRESH_TOKEN);
    res.clearCookie(CONSTANTS.SPOTIFY_USER_ID);
    if (req.path === '/') {
        return res.redirect('/');
    }
    return res.status(401).send(errorResponseFactory.create(errorMessage));
}
errorResponseFactory.create403 = (req, res, errorMessage) => res.status(403).send(errorResponseFactory.create(errorMessage));

export default errorResponseFactory;