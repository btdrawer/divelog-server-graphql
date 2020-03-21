const UserModel = require("../../models/UserModel");
const { getUserId } = require("../../authentication/authUtils");
const removeFalseyProps = require("../../utils/removeFalseyProps");

module.exports = {
  users: (parent, { where, limit, skip }) =>
    UserModel.find(
      {
        ...removeFalseyProps({
          ...where
        })
      },
      null,
      {
        limit,
        skip
      }
    ),
  me: (parent, args, { request }) => {
    const userId = getUserId(request);
    return UserModel.findOne({
      _id: userId
    });
  }
};
