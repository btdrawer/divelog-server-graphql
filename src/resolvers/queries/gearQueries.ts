import { combineResolvers } from "graphql-resolvers";
import { models } from "@btdrawer/divelog-server-utils";
import { isAuthenticated, isGearOwner } from "../middleware";
import { generateUserHashKey } from "../../utils";
import { Context } from "../../types";

const { GearModel } = models;

export const gear = combineResolvers(
    isAuthenticated,
    (parent: any, args: any, { authUserId, runListQuery }: Context) =>
        runListQuery({
            model: GearModel,
            args,
            requiredArgs: {
                owner: authUserId
            },
            hashKey: generateUserHashKey(<string>authUserId)
        })
);

export const gearById = combineResolvers(
    isAuthenticated,
    isGearOwner,
    (parent: any, { id }: any) => GearModel.findById(id)
);
