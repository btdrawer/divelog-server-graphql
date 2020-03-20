const UserModel = require("../../models/user");
const { getUserId } = require("../../authentication/authTools");

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
