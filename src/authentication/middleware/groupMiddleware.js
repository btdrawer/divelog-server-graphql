const GroupModel = require("../../models/GroupModel");
const { NOT_FOUND, FORBIDDEN } = require("../../constants/errorCodes");
const { getUserId } = require("../authUtils");

module.exports = async ({ groupId, request }) => {
  const userId = getUserId(request);
  const group = await GroupModel.findOne({
    _id: groupId
  });
  if (!group) {
    throw new Error(NOT_FOUND);
  }
  if (!group.participants.includes(userId)) {
    throw new Error(FORBIDDEN);
  }
  return undefined;
};
