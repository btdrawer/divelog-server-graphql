const { combineResolvers } = require("graphql-resolvers");

const GearModel = require("../../models/GearModel");

const { isAuthenticated } = require("../middleware");
const { formatQueryOptions, removeFalseyProps } = require("../../utils");

module.exports = {
    gear: combineResolvers(
        isAuthenticated,
        async (parent, { where, ...args }, { authUserId }) => {
            return GearModel.find(
                {
                    owner: authUserId,
                    ...removeFalseyProps({
                        ...where
                    })
                },
                null,
                formatQueryOptions(args)
            );
        }
    )
};
