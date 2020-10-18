import { combineResolvers } from "graphql-resolvers";
import { Dive } from "@btdrawer/divelog-server-core";
import { Context } from "../../types";
import { isAuthenticated, clearUserCache, isDiveUser } from "../middleware";

export const createDive = combineResolvers(
    isAuthenticated,
    clearUserCache,
    async (parent: any, { data }: any, { authUserId }: Context) =>
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
    (parent: any, { id, gearId }: any) =>
        Dive.update(id, {
            $push: {
                gear: gearId
            }
        })
);

export const removeGearFromDive = combineResolvers(
    isAuthenticated,
    isDiveUser,
    clearUserCache,
    (parent: any, { id, gearId }: any) =>
        Dive.update(id, {
            $pull: {
                gear: gearId
            }
        })
);

export const addBuddyToDive = combineResolvers(
    isAuthenticated,
    isDiveUser,
    clearUserCache,
    (parent: any, { id, buddyId }: any) =>
        Dive.update(id, {
            $push: {
                buddies: buddyId
            }
        })
);

export const removeBuddyFromDive = combineResolvers(
    isAuthenticated,
    isDiveUser,
    clearUserCache,
    (parent: any, { id, buddyId }: any) =>
        Dive.update(id, {
            $pull: {
                buddies: buddyId
            }
        })
);

export const deleteDive = combineResolvers(
    isAuthenticated,
    isDiveUser,
    clearUserCache,
    async (parent: any, { id }: any, { authUserId }: Context) => Dive.delete(id)
);
