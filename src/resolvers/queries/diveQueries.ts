import { combineResolvers } from "graphql-resolvers";
import { models } from "@btdrawer/divelog-server-utils";
import { isAuthenticated, isUserOrDiveIsPublic } from "../middleware";
import { generateUserHashKey } from "../../utils";
import { Context } from "../../types";

const { DiveModel } = models;

export const dives = (
    parent: any,
    { userId, ...args }: any,
    { runListQuery }: Context
) =>
    runListQuery({
        model: DiveModel,
        args,
        requiredArgs: {
            user: userId,
            public: true
        },
        hashKey: generateUserHashKey(userId)
    });

export const myDives = combineResolvers(
    isAuthenticated,
    (parent: any, args: any, { authUserId, runListQuery }: Context) =>
        runListQuery({
            model: DiveModel,
            args,
            requiredArgs: {
                user: authUserId
            },
            hashKey: generateUserHashKey(<string>authUserId)
        })
);

export const dive = combineResolvers(
    isUserOrDiveIsPublic,
    (parent: any, { id }: any) => DiveModel.findById(id)
);
