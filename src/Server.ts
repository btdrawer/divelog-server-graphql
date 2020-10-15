import { ApolloServer } from "apollo-server";
import { importSchema } from "graphql-import";
import { makeExecutableSchema } from "graphql-tools";
import DataLoader from "dataloader";
import { RedisPubSub } from "graphql-redis-subscriptions";
import { Services } from "@btdrawer/divelog-server-utils";

import Query from "./resolvers/Query";
import Mutation from "./resolvers/Mutation";
import Subscription from "./resolvers/Subscription";

import * as Dive from "./resolvers/types/Dive";
import * as User from "./resolvers/types/User";
import * as Club from "./resolvers/types/Club";
import * as Group from "./resolvers/types/Group";

import getUserId from "./utils/getUserId";
import {
    batchUser,
    batchDive,
    batchClub,
    batchGear
} from "./utils/batchFunctions";
import runListQuery from "./utils/runListQuery";

class Server {
    instance: ApolloServer;
    services: Services;

    constructor(instance: ApolloServer, services: Services) {
        this.instance = instance;
        this.services = services;
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
                    subscriber: redisClient
                }),
                authUserId: getUserId(request),
                loaders: {
                    userLoader: new DataLoader(batchUser),
                    diveLoader: new DataLoader(batchDive),
                    clubLoader: new DataLoader(batchClub),
                    gearLoader: new DataLoader(batchGear)
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

        process.on("SIGTERM", this.close);
        process.on("SIGINT", this.close);
    }

    close = async () => {
        this.services.closeServices();
        await this.instance.stop();
        console.log("Server closed.");
    };
}

export default Server;
