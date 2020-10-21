import { IResource } from "@btdrawer/divelog-server-core";
import { GraphQLResolveInfo } from "graphql";
import { IFieldResolver } from "graphql-tools";
import { RedisPubSub } from "graphql-redis-subscriptions";
import DataLoader from "dataloader";

export interface Context {
    runListQuery(
        model: IResource<any, any, any>,
        args: any,
        requiredArgs?: any,
        hashKey?: string
    ): Promise<any>;
    queryWithCache: any;
    clearCache(key: string): void;
    pubsub: RedisPubSub;
    authUserId: string;
    loaders: {
        userLoader: DataLoader<any, any>;
        diveLoader: DataLoader<any, any>;
        clubLoader: DataLoader<any, any>;
        gearLoader: DataLoader<any, any>;
    };
}

export type FieldResolver = IFieldResolver<any, Context, GraphQLResolveInfo>;

export * from "./gqlTypeDefs";
