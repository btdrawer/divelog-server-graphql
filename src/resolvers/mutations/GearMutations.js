const { combineResolvers } = require("graphql-resolvers");

const GearModel = require("../../models/GearModel");
const UserModel = require("../../models/UserModel");

const { isAuthenticated, cleanCache, isGearOwner } = require("../middleware");

module.exports = {
    createGear: combineResolvers(
        isAuthenticated,
        cleanCache,
        async (parent, { data }, { authUserId }) => {
            const gear = new GearModel({
                ...data,
                owner: authUserId
            });
            await gear.save();
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
        (parent, { id, data }) =>
            GearModel.findByIdAndUpdate(id, data, { new: true })
    ),
    deleteGear: combineResolvers(
        isAuthenticated,
        isGearOwner,
        cleanCache,
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
