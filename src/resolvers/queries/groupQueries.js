const { combineResolvers } = require("graphql-resolvers");
const { GroupModel } = require("@btdrawer/divelog-server-utils").models;
const { isAuthenticated, isGroupParticipant } = require("../middleware");
const { generateGroupHashKey } = require("../../utils");

module.exports = {
    myGroups: combineResolvers(
        isAuthenticated,
        (parent, args, { runListQuery, authUserId }) =>
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
        async (parent, { id }, { cacheUtils }) => {
            const [group] = await cacheUtils.queryWithCache(
                generateGroupHashKey(id),
                {
                    model: GroupModel,
                    filter: {
                        _id: id
                    }
                }
            );
            return group;
        }
    )
};
