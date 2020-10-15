import { GraphQLResolveInfo } from "graphql";
import { IFieldResolver } from "graphql-tools";
import { CacheUtils, mongooseTypes } from "@btdrawer/divelog-server-utils";
import { RedisPubSub } from "graphql-redis-subscriptions";
import DataLoader from "dataloader";

export interface Context {
    runListQuery: Function;
    cacheUtils: CacheUtils;
    pubsub: RedisPubSub;
    authUserId: String;
    loaders: {
        userLoader: DataLoader<any, any>;
        diveLoader: DataLoader<any, any>;
        clubLoader: DataLoader<any, any>;
        gearLoader: DataLoader<any, any>;
    };
}

export type FieldResolver = IFieldResolver<any, Context, GraphQLResolveInfo>;

export type UserDocument = mongooseTypes.UserDocument;
export type DiveDocument = mongooseTypes.DiveDocument;
export type ClubDocument = mongooseTypes.ClubDocument;
export type GearDocument = mongooseTypes.GearDocument;
export type MessageDocument = mongooseTypes.MessageDocument;
export type GroupDocument = mongooseTypes.GroupDocument;

export * from "./gqlTypeDefs";
