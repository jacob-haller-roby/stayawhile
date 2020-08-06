import redisClient from "../clients/redisClient";
const jsonParser = bodyParser.json();
const urlencodedParser = bodyParser.urlencoded({ extended: false })
import express from 'express';
import bodyParser from "body-parser";
const redis = express();

redis.post('/test', jsonParser, (req, res) => {
    console.log(JSON.stringify(req.body));
    return redisClient.set('redisTest', JSON.stringify(req.body))
        .then(() => redisClient.get('redisTest'))
        .then((val) => res.send(val));
})

redis.get('/test', (req, res) => {
    return redisClient.get('redisTest').then(val => res.send(val));
});

export default redis;