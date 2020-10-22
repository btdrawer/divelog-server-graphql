import { combineResolvers } from "graphql-resolvers";
import { Group, subscriptionKeys } from "@btdrawer/divelog-server-core";
import {
    isAuthenticated,
    isGroupParticipant,
    clearGroupCache
} from "../middleware";
import { Context } from "../../types";

const { newMessageSubscriptionKey } = subscriptionKeys;

export const createGroup = combineResolvers(
    isAuthenticated,
    (parent: any, { data }: any, { authUserId }: Context) =>
        Group.create({
            name: data.name,
            participants: [...data.participants, authUserId],
            messages: [
                {
                    text: data.text,
                    sender: authUserId,
                    sent: new Date()
                }
            ]
        })
);

export const renameGroup = combineResolvers(
    isAuthenticated,
    isGroupParticipant,
    clearGroupCache,
    (parent: any, { id, name }: any) =>
        Group.update(id, {
            name
        })
);

export const sendMessage = combineResolvers(
    isAuthenticated,
    isGroupParticipant,
    clearGroupCache,
    async (parent: any, { id, text }: any, { authUserId, pubsub }: Context) => {
        const group = await Group.sendMessage(id, {
            text,
            sender: authUserId,
            sent: new Date()
        });
        if (pubsub && group) {
            const message = group.messages[group.messages.length - 1];
            pubsub.publish(newMessageSubscriptionKey(id), {
                newMessage: {
                    message: {
                        text: message.text,
                        sender: message.sender,
                        sent: new Date()
                    },
                    group: {
                        id: group._id,
                        name: group.name,
                        participants: group.participants,
                        messages: group.messages.map(message => ({
                            text: message.text,
                            sender: message.sender,
                            sent: message.sent
                        }))
                    }
                }
            });
        }
        return group;
    }
);

export const addGroupParticipant = combineResolvers(
    isAuthenticated,
    isGroupParticipant,
    clearGroupCache,
    (parent: any, { id, userId }: any, { authUserId }: Context) =>
        Group.addUser(id, userId)
);

export const leaveGroup = combineResolvers(
    isAuthenticated,
    isGroupParticipant,
    clearGroupCache,
    (parent: any, { id }: any, { authUserId }: Context) =>
        Group.removeUser(id, authUserId)
);
