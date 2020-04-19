const { combineResolvers } = require("graphql-resolvers");

const DiveModel = require("../../models/DiveModel");
const UserModel = require("../../models/UserModel");

const { isAuthenticated, isDiveUser, cleanCache } = require("../middleware");

module.exports = {
    createDive: combineResolvers(
        isAuthenticated,
        cleanCache,
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
        cleanCache,
        (parent, { id, data }) =>
            DiveModel.findByIdAndUpdate(id, data, {
                new: true
            })
    ),
    addGearToDive: combineResolvers(
        isAuthenticated,
        isDiveUser,
        cleanCache,
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
        cleanCache,
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
        cleanCache,
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
        cleanCache,
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
        cleanCache,
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
