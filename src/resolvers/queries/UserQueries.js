const UserModel = require("../../models/UserModel");
const { getUserId } = require("../../authentication/authUtils");
const removeFalseyProps = require("../../utils/removeFalseyProps");
const formatQueryOptions = require("../../utils/formatQueryOptions");

module.exports = {
    users: (parent, { where, ...args }) =>
        UserModel.find(
            {
                ...removeFalseyProps({
                    ...where
                })
            },
            null,
            formatQueryOptions(args)
        ),
    me: (parent, args, { request }) => {
        const userId = getUserId(request);
        return UserModel.findOne({
            _id: userId
        });
    }
};
