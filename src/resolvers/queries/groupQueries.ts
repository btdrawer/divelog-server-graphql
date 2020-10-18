import { combineResolvers } from "graphql-resolvers";
import { Group } from "@btdrawer/divelog-server-core";
import { isAuthenticated, isGroupParticipant } from "../middleware";
import { generateGroupHashKey } from "../../utils";
import { Context, FieldResolver } from "../../types";

export const myGroups = combineResolvers(
    isAuthenticated,
    (
        parent: any,
        args: any,
        { authUserId, runListQuery }: Context
    ): Promise<FieldResolver> =>
        runListQuery(Group, args, {
            participants: authUserId
        })
);

export const group = combineResolvers(
    isAuthenticated,
    isGroupParticipant,
    async (
        parent: any,
        args: { id: string },
        { queryWithCache }: Context
    ): Promise<FieldResolver> => {
        const [group] = await queryWithCache(generateGroupHashKey(args.id), {
            model: Group,
            filter: {
                _id: args.id
            },
            fields: null,
            options: null
        });
        return group;
    }
);
