const { combineResolvers } = require("graphql-resolvers");
const { models, subscriptionKeys } = require("@btdrawer/divelog-server-utils");
const { GroupModel } = models;
const { newMessageSubscriptionKey } = subscriptionKeys;
const {
    isAuthenticated,
    isGroupParticipant,
    clearGroupCache
} = require("../middleware");

module.exports = {
    createGroup: combineResolvers(
        isAuthenticated,
        async (parent, { data }, { authUserId }) => {
            const { name, participants, text } = data;
            participants.push(authUserId);
            const group = await new GroupModel({
                name,
                participants,
                messages: [
                    {
                        text,
                        sender: authUserId
                    }
                ]
            }).save();
            return group;
        }
    ),
    renameGroup: combineResolvers(
        isAuthenticated,
        isGroupParticipant,
        clearGroupCache,
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
        clearGroupCache,
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
        clearGroupCache,
        (parent, { id, userId }) =>
            GroupModel.findByIdAndUpdate(
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
        clearGroupCache,
        (parent, { id }, { authUserId }) =>
            GroupModel.findByIdAndUpdate(
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
