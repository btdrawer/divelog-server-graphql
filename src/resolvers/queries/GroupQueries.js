const GroupModel = require("../../models/GroupModel");
const { getUserId } = require("../../authentication/authUtils");
const formatQueryOptions = require("../../utils/formatQueryOptions");
const removeFalseyProps = require("../../utils/removeFalseyProps");

module.exports = {
    myGroups: (parent, args, { request }) => {
        const userId = getUserId(request);
        return GroupModel.find(
            {
                participants: userId,
                ...removeFalseyProps(args.where)
            },
            null,
            formatQueryOptions(args)
        );
    }
};
