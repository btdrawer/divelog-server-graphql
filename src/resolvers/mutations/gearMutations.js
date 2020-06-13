const { combineResolvers } = require("graphql-resolvers");
const {
    GearModel,
    UserModel
} = require("@btdrawer/divelog-server-utils").models;
const {
    isAuthenticated,
    clearUserCache,
    isGearOwner
} = require("../middleware");

module.exports = {
    createGear: combineResolvers(
        isAuthenticated,
        clearUserCache,
        async (parent, { data }, { authUserId }) => {
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
    ),
    updateGear: combineResolvers(
        isAuthenticated,
        isGearOwner,
        clearUserCache,
        (parent, { id, data }) =>
            GearModel.findByIdAndUpdate(id, data, { new: true })
    ),
    deleteGear: combineResolvers(
        isAuthenticated,
        isGearOwner,
        clearUserCache,
        async (parent, { id }, { authUserId }) => {
            await UserModel.findByIdAndUpdate(authUserId, {
                $pull: {
                    gear: id
                }
            });
            return GearModel.findOneAndDelete({
                _id: id
            });
        }
    )
};
