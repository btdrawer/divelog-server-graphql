const { combineResolvers } = require("graphql-resolvers");

const GearModel = require("../../models/GearModel");

const { isAuthenticated } = require("../middleware");
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
    )
};
