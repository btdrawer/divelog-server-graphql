const UserModel = require("../../models/user");

const formatAuthPayload = result => ({
  user: {
    id: result._id,
    name: result.name,
    username: result.username,
    email: result.email
  },
  token: result.token
});

module.exports = {
  createUser: async (parent, { data }) => {
    const user = new UserModel(data);
    await user.save();
    return formatAuthPayload(user);
  },
  login: async (parent, { username, password }) => {
    const result = await UserModel.authenticate(username, password);
    return formatAuthPayload(result);
  }
};
