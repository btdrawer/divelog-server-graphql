const { combineResolvers } = require("graphql-resolvers");
const { UserModel } = require("@btdrawer/divelog-server-utils").models;
const { isAuthenticated } = require("../middleware");
const runListQuery = require("../../utils/runListQuery");

module.exports = {
    users: (parent, args) =>
        runListQuery({
            model: UserModel,
            args
        }),
    user: (parent, { id }) => UserModel.findById(id),
    me: combineResolvers(isAuthenticated, (parent, args, { authUserId }) =>
        UserModel.findById(authUserId)
    )
};
