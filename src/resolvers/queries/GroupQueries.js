const { combineResolvers } = require("graphql-resolvers");

const GroupModel = require("../../models/GroupModel");
const { isAuthenticated, isGroupParticipant } = require("../middleware");
const { generateGroupHashKey } = require("../../utils");
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
    group: combineResolvers(
        isAuthenticated,
        isGroupParticipant,
        (parent, { id }) =>
            GroupModel.findById(id).cache({
                hashKey: generateGroupHashKey(id)
            })
    )
};
