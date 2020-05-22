const { combineResolvers } = require("graphql-resolvers");
const { GearModel } = require("@btdrawer/divelog-server-utils").models;
const { isAuthenticated, isGearOwner } = require("../middleware");
const { generateUserHashKey } = require("../../utils");

module.exports = {
    gear: combineResolvers(
        isAuthenticated,
        (parent, args, { runListQuery, authUserId }) =>
            runListQuery({
                model: GearModel,
                args,
                requiredArgs: {
                    owner: authUserId
                },
                hashKey: generateUserHashKey(authUserId)
            })
    ),
    gearById: combineResolvers(isAuthenticated, isGearOwner, (parent, { id }) =>
        GearModel.findById(id)
    )
};
