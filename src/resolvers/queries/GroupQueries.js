const { combineResolvers } = require("graphql-resolvers");

const GroupModel = require("../../models/GroupModel");

const { isAuthenticated } = require("../middleware");
const { formatQueryOptions, removeFalseyProps } = require("../../utils");

module.exports = {
    myGroups: combineResolvers(
        isAuthenticated,
        async (parent, args, { authUserId }) =>
            await GroupModel.find(
                {
                    participants: authUserId,
                    ...removeFalseyProps(args.where)
                },
                null,
                formatQueryOptions(args)
            )
    )
};
