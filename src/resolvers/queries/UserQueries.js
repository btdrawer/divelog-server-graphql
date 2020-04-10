const { combineResolvers } = require("graphql-resolvers");

const UserModel = require("../../models/UserModel");

const { isAuthenticated } = require("../middleware");
const { formatQueryOptions, removeFalseyProps } = require("../../utils");

module.exports = {
    users: async (parent, { where, ...args }) =>
        await UserModel.find(
            {
                ...removeFalseyProps({
                    ...where
                })
            },
            null,
            formatQueryOptions(args)
        ),
    me: combineResolvers(
        isAuthenticated,
        async (parent, args, { authUserId }) =>
            await UserModel.findById(authUserId)
    )
};
