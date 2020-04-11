const { combineResolvers } = require("graphql-resolvers");

const DiveModel = require("../../models/DiveModel");

const { isAuthenticated } = require("../middleware");
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
            }
        });
    },
    myDives: combineResolvers(
        isAuthenticated,
        async (parent, args, { authUserId }) =>
            await runListQuery({
                model: DiveModel,
                args,
                requiredArgs: {
                    user: authUserId
                }
            })
    )
};
