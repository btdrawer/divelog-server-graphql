const UserModel = require("../../models/UserModel");
const { getUserId } = require("../../authentication/authUtils");

module.exports = {
  users: (parent, { limit, skip }) =>
    UserModel.find({}, null, {
      limit,
      skip
    }),
  me: (parent, args, { request }) => {
    const userId = getUserId(request);
    return UserModel.findOne({
      _id: userId
    });
  }
};
