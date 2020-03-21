const GroupModel = require("../../models/GroupModel");
const { getUserId } = require("../../authentication/authUtils");
const groupMiddleware = require("../../authentication/middleware/groupMiddleware");

const updateOperationTemplate = async ({ groupId, data, request }) => {
  await groupMiddleware({
    groupId,
    request
  });
  return GroupModel.findOneAndUpdate(
    {
      _id: groupId
    },
    data,
    { new: true }
  );
};

module.exports = {
  createGroup: async (parent, { data }, { request }) => {
    const myId = getUserId(request);
    const { name, participants, text } = data;
    participants.push(myId);
    const group = new GroupModel({
      name,
      participants,
      messages: [
        {
          text,
          sender: myId
        }
      ]
    });
    await group.save();
    return group;
  },
  renameGroup: (parent, { id, name }, { request }) =>
    updateOperationTemplate({
      groupId: id,
      data: {
        name
      },
      request
    }),
  sendMessage: (parent, { id, text }, { request }) => {
    const userId = getUserId(request);
    return updateOperationTemplate({
      groupId: id,
      data: {
        $push: {
          messages: {
            text,
            sender: userId
          }
        }
      },
      request
    });
  },
  addGroupParticipant: (parent, { groupId, memberId }, { request }) =>
    updateOperationTemplate({
      groupId,
      data: {
        $push: {
          participants: memberId
        }
      },
      request
    }),
  leaveGroup: (parent, { id }, { request }) => {
    const userId = getUserId(request);
    return updateOperationTemplate({
      groupId: id,
      data: {
        $pull: {
          participants: userId
        }
      },
      request
    });
  }
};
