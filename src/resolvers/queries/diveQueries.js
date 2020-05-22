const { combineResolvers } = require("graphql-resolvers");
const { DiveModel } = require("@btdrawer/divelog-server-utils").models;
const { isAuthenticated, isUserOrDiveIsPublic } = require("../middleware");
const { generateUserHashKey } = require("../../utils");

module.exports = {
    dives: async (parent, { userId, ...args }, { runListQuery }) => {
        if (args.where) {
            if (args.where.public) delete args.where.public;
        }
        return await runListQuery({
            model: DiveModel,
            args,
            requiredArgs: {
                user: userId,
                public: true
            },
            hashKey: generateUserHashKey(userId)
        });
    },
    myDives: combineResolvers(
        isAuthenticated,
        (parent, args, { runListQuery, authUserId }) =>
            runListQuery({
                model: DiveModel,
                args,
                requiredArgs: {
                    user: authUserId
                },
                hashKey: generateUserHashKey(authUserId)
            })
    ),
    dive: combineResolvers(isUserOrDiveIsPublic, (parent, { id }) =>
        DiveModel.findById(id)
    )
};
