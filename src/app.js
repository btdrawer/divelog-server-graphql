const getServer = require("./server");
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

const server = getServer({
    context: {
        ...pubsub
    }
});

server.listen().then(({ url }) => console.log(`Server listening on ${url}.`));
