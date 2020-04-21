const { combineResolvers } = require("graphql-resolvers");

const DiveModel = require("../../models/DiveModel");
const { isAuthenticated, isUserOrDiveIsPublic } = require("../middleware");
const { generateUserHashKey } = require("../../utils");
const runListQuery = require("../../utils/runListQuery");

module.exports = {
    dives: async (parent, { userId, ...args }) => {
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
            hashKeyArg: generateUserHashKey(userId)
        });
    },
    myDives: combineResolvers(isAuthenticated, (parent, args, { authUserId }) =>
        runListQuery({
            model: DiveModel,
            args,
            requiredArgs: {
                user: authUserId
            },
            hashKeyArg: generateUserHashKey(authUserId)
        })
    ),
    dive: combineResolvers(isUserOrDiveIsPublic, (parent, { id }) =>
        DiveModel.findById(id)
    )
};
