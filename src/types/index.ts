import { GraphQLResolveInfo } from "graphql";
import { IFieldResolver } from "graphql-tools";
import { documentTypes } from "@btdrawer/divelog-server-core";
import { RedisPubSub } from "graphql-redis-subscriptions";
import DataLoader from "dataloader";

export interface Context {
    runListQuery(
        model: documentTypes.IResource<any, any, any>,
        args: any,
        requiredArgs?: any,
        hashKey?: string
    ): Promise<any>;
    queryWithCache: any;
    clearCache: any;
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

export type UserDocument = documentTypes.UserDocument;
export type DiveDocument = documentTypes.DiveDocument;
export type ClubDocument = documentTypes.ClubDocument;
export type GearDocument = documentTypes.GearDocument;
export type MessageDocument = documentTypes.MessageDocument;
export type GroupDocument = documentTypes.GroupDocument;

export * from "./gqlTypeDefs";
