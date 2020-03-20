const { getUserId } = require("../../authentication/authTools");

module.exports = {
  email: ({ id, email }, args, { request }) => {
    const userId = getUserId(request);
    if (userId && userId === id) {
      return email;
    }
    return undefined;
  }
};
