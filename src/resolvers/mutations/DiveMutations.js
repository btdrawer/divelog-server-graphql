const { combineResolvers } = require("graphql-resolvers");

const DiveModel = require("../../models/DiveModel");
const UserModel = require("../../models/UserModel");
const {
    isAuthenticated,
    isDiveUser,
    clearUserCache
} = require("../middleware");

module.exports = {
    createDive: combineResolvers(
        isAuthenticated,
        clearUserCache,
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
            return dive;
        }
    ),
    updateDive: combineResolvers(
        isAuthenticated,
        isDiveUser,
        clearUserCache,
        (parent, { id, data }) =>
            DiveModel.findByIdAndUpdate(id, data, {
                new: true
            })
    ),
    addGearToDive: combineResolvers(
        isAuthenticated,
        isDiveUser,
        clearUserCache,
        (parent, { id, gearId }) =>
            DiveModel.findByIdAndUpdate(
                id,
                {
                    $push: {
                        gear: gearId
                    }
                },
                { new: true }
            )
    ),
    removeGearFromDive: combineResolvers(
        isAuthenticated,
        isDiveUser,
        clearUserCache,
        (parent, { id, gearId }) =>
            DiveModel.findByIdAndUpdate(
                id,
                {
                    $pull: {
                        gear: gearId
                    }
                },
                { new: true }
            )
    ),
    addBuddyToDive: combineResolvers(
        isAuthenticated,
        isDiveUser,
        clearUserCache,
        (parent, { id, buddyId }) =>
            DiveModel.findByIdAndUpdate(
                id,
                {
                    $push: {
                        buddies: buddyId
                    }
                },
                { new: true }
            )
    ),
    removeBuddyFromDive: combineResolvers(
        isAuthenticated,
        isDiveUser,
        clearUserCache,
        (parent, { id, buddyId }) =>
            DiveModel.findByIdAndUpdate(
                id,
                {
                    $pull: {
                        buddies: buddyId
                    }
                },
                { new: true }
            )
    ),
    deleteDive: combineResolvers(
        isAuthenticated,
        isDiveUser,
        clearUserCache,
        async (parent, { id }, { authUserId }) => {
            const dive = await DiveModel.findByIdAndDelete(id);
            await UserModel.findByIdAndUpdate(authUserId, {
                $pull: {
                    dives: dive.id
                }
            });
            return dive;
        }
    )
};
