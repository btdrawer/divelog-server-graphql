const { combineResolvers } = require("graphql-resolvers");

const DiveModel = require("../../models/DiveModel");

const { isAuthenticated } = require("../middleware");
const { formatQueryOptions, removeFalseyProps } = require("../../utils");

module.exports = {
    dives: async (parent, { userId, where, ...args }) => {
        if (where) {
            if (where.public) delete where.public;
        }
        return await DiveModel.find(
            {
                user: userId,
                public: true,
                ...removeFalseyProps({
                    ...where
                })
            },
            null,
            formatQueryOptions(args)
        );
    },
    myDives: combineResolvers(
        isAuthenticated,
        async (parent, { where, ...args }, { authUserId }) =>
            await DiveModel.find(
                {
                    user: authUserId,
                    ...removeFalseyProps({
                        ...where
                    })
                },
                null,
                formatQueryOptions(args)
            )
    )
};
