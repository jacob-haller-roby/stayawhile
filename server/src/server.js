import 'source-map-support/register';
import express from 'express';
import path from 'path';
import spotify from "./controllers/spotify";
import logger from "./util/logger";
import room from "./controllers/room";

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
app.use('/room', room);



app.listen(process.env.SERVER_PORT, '0.0.0.0');