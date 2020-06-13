const { combineResolvers } = require("graphql-resolvers");
const { DiveModel } = require("@btdrawer/divelog-server-utils").models;
const { isAuthenticated, isUserOrDiveIsPublic } = require("../middleware");
const { generateUserHashKey } = require("../../utils");

module.exports = {
    dives: (parent, { userId, ...args }, { runListQuery }) =>
        runListQuery({
            model: DiveModel,
            args,
            requiredArgs: {
                user: userId,
                public: true
            },
            hashKey: generateUserHashKey(userId)
        }),
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
