const { combineResolvers } = require("graphql-resolvers");

const GroupModel = require("../../models/GroupModel");

const { isAuthenticated } = require("../middleware");
const runListQuery = require("../../utils/runListQuery");

module.exports = {
    myGroups: combineResolvers(
        isAuthenticated,
        (parent, args, { authUserId }) =>
            runListQuery({
                model: GroupModel,
                args,
                requiredArgs: {
                    participants: authUserId
                }
            })
    ),
    group: combineResolvers(isAuthenticated, (parent, { id }) =>
        GroupModel.findById(id)
    )
};
