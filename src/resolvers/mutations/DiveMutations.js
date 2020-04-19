const { combineResolvers } = require("graphql-resolvers");

const DiveModel = require("../../models/DiveModel");
const UserModel = require("../../models/UserModel");

const { isAuthenticated, isDiveUser } = require("../middleware");
const { cleanCache } = require("../../utils/cacheUtils");

module.exports = {
    createDive: combineResolvers(
        isAuthenticated,
        async (parent, { data }, { authUserId }) => {
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
            cleanCache(authUserId);
            return dive;
        }
    ),
    updateDive: combineResolvers(
        isAuthenticated,
        isDiveUser,
        async (parent, { id, data }, { authUserId }) => {
            const result = await DiveModel.findByIdAndUpdate(id, data, {
                new: true
            });
            cleanCache(authUserId);
            return result;
        }
    ),
    addGearToDive: combineResolvers(
        isAuthenticated,
        isDiveUser,
        async (parent, { id, gearId }, { authUserId }) => {
            const dive = await DiveModel.findByIdAndUpdate(
                id,
                {
                    $push: {
                        gear: gearId
                    }
                },
                { new: true }
            );
            cleanCache(authUserId);
            return dive;
        }
    ),
    removeGearFromDive: combineResolvers(
        isAuthenticated,
        isDiveUser,
        async (parent, { id, gearId }, { authUserId }) => {
            const result = await DiveModel.findByIdAndUpdate(
                id,
                {
                    $pull: {
                        gear: gearId
                    }
                },
                { new: true }
            );
            cleanCache(authUserId);
            return result;
        }
    ),
    addBuddyToDive: combineResolvers(
        isAuthenticated,
        isDiveUser,
        async (parent, { id, buddyId }, { authUserId }) => {
            const result = await DiveModel.findByIdAndUpdate(
                id,
                {
                    $push: {
                        buddies: buddyId
                    }
                },
                { new: true }
            );
            cleanCache(authUserId);
            return result;
        }
    ),
    removeBuddyFromDive: combineResolvers(
        isAuthenticated,
        isDiveUser,
        async (parent, { id, buddyId }, { authUserId }) => {
            const result = await DiveModel.findByIdAndUpdate(
                id,
                {
                    $pull: {
                        buddies: buddyId
                    }
                },
                { new: true }
            );
            cleanCache(authUserId);
            return result;
        }
    ),
    deleteDive: combineResolvers(
        isAuthenticated,
        isDiveUser,
        async (parent, { id }, { authUserId }) => {
            const dive = await DiveModel.findByIdAndDelete(id);
            await UserModel.findByIdAndUpdate(authUserId, {
                $pull: {
                    dives: dive.id
                }
            });
            cleanCache(authUserId);
            return dive;
        }
    )
};
