import { combineResolvers } from "graphql-resolvers";
import { models } from "@btdrawer/divelog-server-utils";
import { Context } from "../../types";
import { isAuthenticated, clearUserCache, isDiveUser } from "../middleware";

const { DiveModel, UserModel } = models;

export const createDive = combineResolvers(
    isAuthenticated,
    clearUserCache,
    async (parent: any, { data }: any, { authUserId }: Context) => {
        const dive = new DiveModel({
            ...data,
            user: authUserId
        });
        await dive.save();
        await UserModel.findByIdAndUpdate(authUserId, {
            $push: {
                dives: dive.id
            }
        });
        return dive;
    }
);

export const updateDive = combineResolvers(
    isAuthenticated,
    isDiveUser,
    clearUserCache,
    (parent: any, { id, data }: any) =>
        DiveModel.findByIdAndUpdate(id, data, {
            new: true
        })
);

export const addGearToDive = combineResolvers(
    isAuthenticated,
    isDiveUser,
    clearUserCache,
    (parent: any, { id, gearId }: any) =>
        DiveModel.findByIdAndUpdate(
            id,
            {
                $push: {
                    gear: gearId
                }
            },
            { new: true }
        )
);

export const removeGearFromDive = combineResolvers(
    isAuthenticated,
    isDiveUser,
    clearUserCache,
    (parent: any, { id, gearId }: any) =>
        DiveModel.findByIdAndUpdate(
            id,
            {
                $pull: {
                    gear: gearId
                }
            },
            { new: true }
        )
);

export const addBuddyToDive = combineResolvers(
    isAuthenticated,
    isDiveUser,
    clearUserCache,
    (parent: any, { id, buddyId }: any) =>
        DiveModel.findByIdAndUpdate(
            id,
            {
                $push: {
                    buddies: buddyId
                }
            },
            { new: true }
        )
);

export const removeBuddyFromDive = combineResolvers(
    isAuthenticated,
    isDiveUser,
    clearUserCache,
    (parent: any, { id, buddyId }: any) =>
        DiveModel.findByIdAndUpdate(
            id,
            {
                $pull: {
                    buddies: buddyId
                }
            },
            { new: true }
        )
);

export const deleteDive = combineResolvers(
    isAuthenticated,
    isDiveUser,
    clearUserCache,
    async (parent: any, { id }: any, { authUserId }: Context) => {
        const dive = await DiveModel.findByIdAndDelete(id);
        await UserModel.findByIdAndUpdate(authUserId, {
            $pull: {
                dives: dive ? dive.id : null
            }
        });
        return dive;
    }
);
