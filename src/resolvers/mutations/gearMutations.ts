import { combineResolvers } from "graphql-resolvers";
import { Gear } from "@btdrawer/divelog-server-core";
import { isAuthenticated, clearUserCache, isGearOwner } from "../middleware";
import { Context } from "../../types";

export const createGear = combineResolvers(
    isAuthenticated,
    clearUserCache,
    (parent: any, { data }: any, { authUserId }: Context) =>
        Gear.create({
            ...data,
            owner: authUserId
        })
);

export const updateGear = combineResolvers(
    isAuthenticated,
    isGearOwner,
    clearUserCache,
    (parent: any, { id, data }: any) => Gear.update(id, data)
);

export const deleteGear = combineResolvers(
    isAuthenticated,
    isGearOwner,
    clearUserCache,
    (parent: any, { id }: any) => Gear.delete(id)
);
