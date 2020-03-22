const GroupModel = require("../../models/GroupModel");
const { getUserId } = require("../../authentication/authUtils");
const groupMiddleware = require("../../authentication/middleware/groupMiddleware");
const {
    newMessageSubscriptionKey
} = require("../../constants/subscriptionKeys");

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
    sendMessage: async (parent, { id, text }, { request, pubsub }) => {
        const userId = getUserId(request);
        const group = await updateOperationTemplate({
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
        const message = group.messages.pop();
        pubsub.publish(newMessageSubscriptionKey(id), {
            newMessage: {
                message: {
                    id: message._id,
                    text: message.text,
                    sender: message.sender
                },
                group: {
                    id: group._id,
                    name: group.name,
                    participants: group.participants,
                    messages: group.messages.map(message => ({
                        id: message._id,
                        text: message.text,
                        sender: message.sender
                    }))
                }
            }
        });
        return group;
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
