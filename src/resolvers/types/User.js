const { getUserId } = require("../../authentication/authUtils");

module.exports = {
  email: async ({ id, email }, args, { request }) => {
    const userId = getUserId(request);
    if (userId && userId === id) {
      return email;
    }
    return undefined;
  }
};
