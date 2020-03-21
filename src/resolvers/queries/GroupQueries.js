const GroupModel = require("../../models/GroupModel");
const { getUserId } = require("../../authentication/authUtils");

module.exports = {
  myGroups: (parent, { limit, skip }, { request }) => {
    const userId = getUserId(request);
    return GroupModel.find(
      {
        participants: userId
      },
      null,
      { limit, skip }
    );
  }
};
