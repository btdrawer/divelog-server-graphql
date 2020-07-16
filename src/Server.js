const { ApolloServer } = require("apollo-server");
const { importSchema } = require("graphql-import");
const { makeExecutableSchema } = require("graphql-tools");
const DataLoader = require("dataloader");
const { RedisPubSub } = require("graphql-redis-subscriptions");
const { Services } = require("@btdrawer/divelog-server-utils");

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

class Server {
    constructor(instance, services) {
        this.instance = instance;
        this.services = services;
        this.close = this.close.bind(this);
    }

    static async build() {
        const services = await Services.launchServices();
        const { redisClient, cacheUtils } = services.cache;

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

        const instance = new ApolloServer({
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

        return new Server(instance, services);
    }

    launch() {
        this.instance
            .listen({
                port: process.env.SERVER_PORT
            })
            .then(({ url }) => console.log(`Server listening on ${url}.`));
    }

    async close() {
        this.services.closeServices();
        await this.instance.stop();
        console.log("Server closed.");
    }
}

module.exports = Server;
