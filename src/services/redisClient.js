const redis = require("redis");
const { promisify } = require("util");

const redisUrl = `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`;
const redisClient = redis.createClient(redisUrl);

redisClient.hget = promisify(redisClient.hget);

module.exports = redisClient;
