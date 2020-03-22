const { ApolloServer } = require("apollo-server");
const { importSchema } = require("graphql-import");
const { makeExecutableSchema } = require("graphql-tools");
const { RedisPubSub } = require("graphql-redis-subscriptions");
const Redis = require("ioredis");

const Query = require("./resolvers/Query");
const Mutation = require("./resolvers/Mutation");
const Subscription = require("./resolvers/Subscription");

const Dive = require("./resolvers/types/Dive");
const User = require("./resolvers/types/User");
const Club = require("./resolvers/types/Club");
const Group = require("./resolvers/types/Group");

require("./db");

const redisOptions = {
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT
};

const pubsub = new RedisPubSub({
  publisher: new Redis(redisOptions),
  subscribe: new Redis(redisOptions)
});

const executableSchema = makeExecutableSchema({
  typeDefs: importSchema("src/schema.graphql"),
  resolvers: {
    Query,
    Mutation,
    Subscription,
    User,
    Club,
    Dive,
    Group
  }
});

const server = new ApolloServer({
  schema: executableSchema,
  context: request => ({
    request,
    pubsub
  })
});

server.listen().then(({ url }) => console.log(`Server listening on ${url}.`));
