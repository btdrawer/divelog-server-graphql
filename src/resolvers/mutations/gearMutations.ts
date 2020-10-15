import { combineResolvers } from "graphql-resolvers";
import { models } from "@btdrawer/divelog-server-utils";
import { isAuthenticated, clearUserCache, isGearOwner } from "../middleware";
import { Context } from "../../types";

const { GearModel, UserModel } = models;

export const createGear = combineResolvers(
    isAuthenticated,
    clearUserCache,
    async (parent: any, { data }: any, { authUserId }: Context) => {
        const gear = await new GearModel({
            ...data,
            owner: authUserId
        }).save();
        await UserModel.findByIdAndUpdate(authUserId, {
            $push: {
                gear: gear.id
            }
        });
        return gear;
    }
);

export const updateGear = combineResolvers(
    isAuthenticated,
    isGearOwner,
    clearUserCache,
    (parent: any, { id, data }: any) =>
        GearModel.findByIdAndUpdate(id, data, { new: true })
);

export const deleteGear = combineResolvers(
    isAuthenticated,
    isGearOwner,
    clearUserCache,
    async (parent: any, { id }: any, { authUserId }: Context) => {
        await UserModel.findByIdAndUpdate(authUserId, {
            $pull: {
                gear: id
            }
        });
        return GearModel.findByIdAndDelete(id);
    }
);
