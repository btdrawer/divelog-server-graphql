import { combineResolvers } from "graphql-resolvers";
import { models } from "@btdrawer/divelog-server-utils";
import { isAuthenticated, isGroupParticipant } from "../middleware";
import { generateGroupHashKey } from "../../utils";
import { Context, FieldResolver } from "../../types";

const { GroupModel } = models;

export const myGroups = combineResolvers(
    isAuthenticated,
    (
        parent: any,
        args: any,
        { authUserId, runListQuery }: Context
    ): Promise<FieldResolver> =>
        runListQuery({
            model: GroupModel,
            args,
            requiredArgs: {
                participants: authUserId
            }
        })
);

export const group = combineResolvers(
    isAuthenticated,
    isGroupParticipant,
    async (
        parent: any,
        args: { id: string },
        { cacheUtils }: Context
    ): Promise<FieldResolver> => {
        const [group] = await cacheUtils.queryWithCache(
            generateGroupHashKey(args.id),
            {
                model: GroupModel,
                filter: {
                    _id: args.id
                },
                fields: null,
                options: null
            }
        );
        return group;
    }
);
