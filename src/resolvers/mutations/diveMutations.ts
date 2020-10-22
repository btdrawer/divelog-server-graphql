import { combineResolvers } from "graphql-resolvers";
import { Dive } from "@btdrawer/divelog-server-core";
import { Context } from "../../types";
import { isAuthenticated, clearUserCache, isDiveUser } from "../middleware";

export const createDive = combineResolvers(
    isAuthenticated,
    clearUserCache,
    (parent: any, { data }: any, { authUserId }: Context) =>
        Dive.create({
            ...data,
            user: authUserId
        })
);

export const updateDive = combineResolvers(
    isAuthenticated,
    isDiveUser,
    clearUserCache,
    (parent: any, { id, data }: any) => Dive.update(id, data)
);

export const addGearToDive = combineResolvers(
    isAuthenticated,
    isDiveUser,
    clearUserCache,
    (parent: any, { id, gearId }: any) => Dive.addGear(id, gearId)
);

export const removeGearFromDive = combineResolvers(
    isAuthenticated,
    isDiveUser,
    clearUserCache,
    (parent: any, { id, gearId }: any) => Dive.removeGear(id, gearId)
);

export const addBuddyToDive = combineResolvers(
    isAuthenticated,
    isDiveUser,
    clearUserCache,
    (parent: any, { id, buddyId }: any) => Dive.addBuddy(id, buddyId)
);

export const removeBuddyFromDive = combineResolvers(
    isAuthenticated,
    isDiveUser,
    clearUserCache,
    (parent: any, { id, buddyId }: any) => Dive.removeBuddy(id, buddyId)
);

export const deleteDive = combineResolvers(
    isAuthenticated,
    isDiveUser,
    clearUserCache,
    (parent: any, { id }: any) => Dive.delete(id)
);
