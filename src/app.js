const server = require("./server");
require("./db");

const { RedisPubSub } = require("graphql-redis-subscriptions");
const Redis = require("ioredis");

const redisOptions = {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT
};

const pubsub = new RedisPubSub({
    publisher: new Redis(redisOptions),
    subscribe: new Redis(redisOptions)
});

server.context.pubsub = pubsub;

server
    .listen({
        port: process.env.SERVER_PORT
    })
    .then(({ url }) => console.log(`Server listening on ${url}.`));
