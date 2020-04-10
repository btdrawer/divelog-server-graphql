const { combineResolvers } = require("graphql-resolvers");

const GroupModel = require("../../models/GroupModel");
const {
    newMessageSubscriptionKey
} = require("../../constants/subscriptionKeys");
const { isAuthenticated, isGroupParticipant } = require("../middleware");

module.exports = {
    createGroup: combineResolvers(
        isAuthenticated,
        async (parent, { data }, { authUserId }) => {
            const { name, participants, text } = data;
            participants.push(authUserId);
            const group = new GroupModel({
                name,
                participants,
                messages: [
                    {
                        text,
                        sender: authUserId
                    }
                ]
            });
            await group.save();
            return group;
        }
    ),
    renameGroup: combineResolvers(
        isAuthenticated,
        isGroupParticipant,
        (parent, { id, name }) =>
            GroupModel.findByIdAndUpdate(
                id,
                {
                    name
                },
                { new: true }
            )
    ),
    sendMessage: combineResolvers(
        isAuthenticated,
        isGroupParticipant,
        async (parent, { id, text }, { authUserId, pubsub }) => {
            const group = await GroupModel.findByIdAndUpdate(
                id,
                {
                    $push: {
                        messages: {
                            text,
                            sender: authUserId
                        }
                    }
                },
                { new: true }
            );
            if (pubsub) {
                const message = group.messages[group.messages.length - 1];
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
            }
            return group;
        }
    ),
    addGroupParticipant: combineResolvers(
        isAuthenticated,
        isGroupParticipant,
        async (parent, { id, userId }) =>
            await GroupModel.findByIdAndUpdate(
                id,
                {
                    $push: {
                        participants: userId
                    }
                },
                { new: true }
            )
    ),
    leaveGroup: combineResolvers(
        isAuthenticated,
        isGroupParticipant,
        async (parent, { id }, { authUserId }) =>
            await GroupModel.findByIdAndUpdate(
                id,
                {
                    $pull: {
                        participants: authUserId
                    }
                },
                { new: true }
            )
    )
};
