const GroupModel = require("../../models/GroupModel");
const { getUserId } = require("../../authentication/authUtils");
const formatQueryOptions = require("../../utils/formatQueryOptions");

module.exports = {
    myGroups: (parent, args, { request }) => {
        const userId = getUserId(request);
        return GroupModel.find(
            {
                participants: userId
            },
            null,
            formatQueryOptions(args)
        );
    }
};
