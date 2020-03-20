const UserModel = require("../../models/UserModel");

module.exports = {
  managers: async ({ managers }) =>
    UserModel.find({
      _id: {
        $in: managers
      }
    })
};
