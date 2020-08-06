import express from 'express';
import path from 'path';
import spotify from "./controllers/spotify";
import redis from "./controllers/redis";
import logger from "./util/logger";

logger.debug(process.env);
logger.log(process.env.IS_DEVELOPMENT);

const app = express();

app.use((req, res, next) => {
   logger.log((new Date()).toISOString(), req.path);
   next();
});
app.use(express.static(path.join(__dirname, 'build')));
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.use('/spotify', spotify);
app.use('/redis', redis);



app.listen(process.env.SERVER_PORT, '0.0.0.0');