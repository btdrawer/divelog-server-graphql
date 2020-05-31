const { ApolloServer } = require("apollo-server");
const { importSchema } = require("graphql-import");
const { makeExecutableSchema } = require("graphql-tools");
const DataLoader = require("dataloader");
const { RedisPubSub } = require("graphql-redis-subscriptions");
const { launchServices } = require("@btdrawer/divelog-server-utils");

const Query = require("./resolvers/Query");
const Mutation = require("./resolvers/Mutation");
const Subscription = require("./resolvers/Subscription");

const Dive = require("./resolvers/types/Dive");
const User = require("./resolvers/types/User");
const Club = require("./resolvers/types/Club");
const Group = require("./resolvers/types/Group");

const getUserId = require("./utils/getUserId");
const {
    batchUser,
    batchDive,
    batchClub,
    batchGear
} = require("./utils/batchFunctions");
const runListQuery = require("./utils/runListQuery");

module.exports = async () => {
    const {
        cache: { redisClient, cacheUtils },
        closeServices
    } = await launchServices();

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
            runListQuery: runListQuery(cacheUtils.queryWithCache),
            cacheUtils,
            pubsub: new RedisPubSub({
                publisher: redisClient,
                subscribe: redisClient
            }),
            authUserId: getUserId(request),
            loaders: {
                userLoader: new DataLoader(keys => batchUser(keys)),
                diveLoader: new DataLoader(keys => batchDive(keys)),
                clubLoader: new DataLoader(keys => batchClub(keys)),
                gearLoader: new DataLoader(keys => batchGear(keys))
            }
        })
    });

    const closeServer = async () => {
        await closeServices();
        await server.stop();
        console.log("Server closed.");
    };

    return { server, closeServer };
};
