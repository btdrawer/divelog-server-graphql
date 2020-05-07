const { ApolloServer } = require("apollo-server");
const { importSchema } = require("graphql-import");
const { makeExecutableSchema } = require("graphql-tools");
const DataLoader = require("dataloader");
const { RedisPubSub } = require("graphql-redis-subscriptions");
const { connect } = require("@btdrawer/divelog-server-utils");
const getUserId = require("./utils/getUserId");

const Query = require("./resolvers/Query");
const Mutation = require("./resolvers/Mutation");
const Subscription = require("./resolvers/Subscription");

const Dive = require("./resolvers/types/Dive");
const User = require("./resolvers/types/User");
const Club = require("./resolvers/types/Club");
const Group = require("./resolvers/types/Group");

const {
    batchUser,
    batchDive,
    batchClub,
    batchGear
} = require("./utils/batchFunctions");

const { db, redisClient } = connect();

const pubsub = new RedisPubSub({
    publisher: redisClient,
    subscribe: redisClient
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

const closeDatabase = async () => {
    await db.close();
};

process.on("SIGTERM", closeDatabase);
process.on("SIGINT", closeDatabase);

module.exports = new ApolloServer({
    schema: executableSchema,
    context: request => ({
        redisClient,
        pubsub,
        authUserId: getUserId(request),
        loaders: {
            userLoader: new DataLoader(keys => batchUser(keys)),
            diveLoader: new DataLoader(keys => batchDive(keys)),
            clubLoader: new DataLoader(keys => batchClub(keys)),
            gearLoader: new DataLoader(keys => batchGear(keys))
        }
    })
});
