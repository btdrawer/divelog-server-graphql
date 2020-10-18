import { combineResolvers } from "graphql-resolvers";
import { Dive } from "@btdrawer/divelog-server-core";
import { isAuthenticated, isUserOrDiveIsPublic } from "../middleware";
import { generateUserHashKey } from "../../utils";
import { Context } from "../../types";

export const dives = (
    parent: any,
    { userId, ...args }: any,
    { runListQuery }: Context
) =>
    runListQuery(
        Dive,
        args,
        {
            user: userId,
            public: true
        },
        generateUserHashKey(userId)
    );

export const myDives = combineResolvers(
    isAuthenticated,
    (parent: any, args: any, { authUserId, runListQuery }: Context) =>
        runListQuery(
            Dive,
            args,
            {
                user: authUserId
            },
            generateUserHashKey(authUserId)
        )
);

export const dive = combineResolvers(
    isUserOrDiveIsPublic,
    (parent: any, { id }: any) => Dive.get(id)
);
