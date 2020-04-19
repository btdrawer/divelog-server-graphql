const { combineResolvers } = require("graphql-resolvers");

const DiveModel = require("../../models/DiveModel");

const { isAuthenticated, isUserOrDiveIsPublic } = require("../middleware");
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
            hashKeyArg: "user"
        });
    },
    myDives: combineResolvers(isAuthenticated, (parent, args, { authUserId }) =>
        runListQuery({
            model: DiveModel,
            args,
            requiredArgs: {
                user: authUserId
            },
            hashKeyArg: "user"
        })
    ),
    dive: combineResolvers(isUserOrDiveIsPublic, (parent, { id }) =>
        DiveModel.findById(id)
    )
};
