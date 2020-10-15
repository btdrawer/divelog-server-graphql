import { combineResolvers } from "graphql-resolvers";
import { models, subscriptionKeys } from "@btdrawer/divelog-server-utils";
import {
    isAuthenticated,
    isGroupParticipant,
    clearGroupCache
} from "../middleware";
import { Context } from "../../types";

const { newMessageSubscriptionKey } = subscriptionKeys;
const { GroupModel } = models;

export const createGroup = combineResolvers(
    isAuthenticated,
    async (parent: any, { data }: any, { authUserId }: Context) => {
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
);

export const renameGroup = combineResolvers(
    isAuthenticated,
    isGroupParticipant,
    clearGroupCache,
    (parent: any, { id, name }: any) =>
        GroupModel.findByIdAndUpdate(
            id,
            {
                name
            },
            { new: true }
        )
);

export const sendMessage = combineResolvers(
    isAuthenticated,
    isGroupParticipant,
    clearGroupCache,
    async (parent: any, { id, text }: any, { authUserId, pubsub }: Context) => {
        const group = await GroupModel.findByIdAndUpdate(
            id,
            {
                push: {
                    messages: {
                        text,
                        sender: authUserId
                    }
                }
            },
            { new: true }
        );
        if (pubsub && group) {
            const message = group.messages[group.messages.length - 1];
            pubsub.publish(newMessageSubscriptionKey(id), {
                newMessage: {
                    message: {
                        id: message.id,
                        text: message.text,
                        sender: message.sender
                    },
                    group: {
                        id: group._id,
                        name: group.name,
                        participants: group.participants,
                        messages: group.messages.map(message => ({
                            id: message.id,
                            text: message.text,
                            sender: message.sender
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
    (parent: any, { id, userId }: any) =>
        GroupModel.findByIdAndUpdate(
            id,
            {
                $push: {
                    participants: userId
                }
            },
            { new: true }
        )
);

export const leaveGroup = combineResolvers(
    isAuthenticated,
    isGroupParticipant,
    clearGroupCache,
    (parent: any, { id }: any, { authUserId }: Context) =>
        GroupModel.findByIdAndUpdate(
            id,
            {
                $pull: {
                    participants: authUserId
                }
            },
            { new: true }
        )
);
