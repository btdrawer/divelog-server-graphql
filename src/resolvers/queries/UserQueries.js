const { combineResolvers } = require("graphql-resolvers");

const UserModel = require("../../models/UserModel");

const { isAuthenticated } = require("../middleware");
const runListQuery = require("../../utils/runListQuery");

module.exports = {
    users: async (parent, args) =>
        await runListQuery({
            model: UserModel,
            args
        }),
    me: combineResolvers(
        isAuthenticated,
        async (parent, args, { authUserId }) =>
            await UserModel.findById(authUserId)
    )
};
