const { combineResolvers } = require("graphql-resolvers");

const GearModel = require("../../models/GearModel");

const { isAuthenticated, isGearOwner } = require("../middleware");
const runListQuery = require("../../utils/runListQuery");

module.exports = {
    gear: combineResolvers(isAuthenticated, (parent, args, { authUserId }) =>
        runListQuery({
            model: GearModel,
            args,
            requiredArgs: {
                owner: authUserId
            },
            hashKey: "owner"
        })
    ),
    gearById: combineResolvers(isAuthenticated, isGearOwner, (parent, { id }) =>
        GearModel.findById(id)
    )
};
