
const errorResponseFactory = {};

errorResponseFactory.create = (errorMessage) => ({errorMessage});
errorResponseFactory.create401 = (res, errorMessage) => res.status(401).send(errorResponseFactory.create(errorMessage));
errorResponseFactory.create403 = (res, errorMessage) => res.status(403).send(errorResponseFactory.create(errorMessage));

export default errorResponseFactory;