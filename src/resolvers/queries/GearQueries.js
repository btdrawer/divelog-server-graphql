const { combineResolvers } = require("graphql-resolvers");

const GearModel = require("../../models/GearModel");

const { isAuthenticated, isGearOwner } = require("../middleware");
const runListQuery = require("../../utils/runListQuery");

module.exports = {
    gear: combineResolvers(
        isAuthenticated,
        async (parent, args, { authUserId }) =>
            runListQuery({
                model: GearModel,
                args,
                requiredArgs: {
                    owner: authUserId
                }
            })
    ),
    gearById: combineResolvers(
        isAuthenticated,
        isGearOwner,
        async (parent, { id }) => await GearModel.findById(id)
    )
};
