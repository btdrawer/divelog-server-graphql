import { combineResolvers } from "graphql-resolvers";
import { Gear } from "@btdrawer/divelog-server-core";
import { isAuthenticated, isGearOwner } from "../middleware";
import { generateUserHashKey } from "../../utils";
import { Context } from "../../types";

export const gear = combineResolvers(
    isAuthenticated,
    (parent: any, args: any, { authUserId, runListQuery }: Context) =>
        runListQuery(
            Gear,
            args,
            {
                owner: authUserId
            },
            generateUserHashKey(authUserId)
        )
);

export const gearById = combineResolvers(
    isAuthenticated,
    isGearOwner,
    (parent: any, { id }: any) => Gear.get(id)
);
