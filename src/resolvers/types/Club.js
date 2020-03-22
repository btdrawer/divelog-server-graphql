const UserModel = require("../../models/UserModel");

module.exports = {
    managers: ({ managers }) =>
        UserModel.find({
            _id: {
                $in: managers
            }
        }),
    members: ({ members }) =>
        UserModel.find({
            _id: {
                $in: members
            }
        })
};
