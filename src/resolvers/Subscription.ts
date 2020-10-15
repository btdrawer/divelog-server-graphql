import { combineResolvers } from "graphql-resolvers";
import { subscriptionKeys } from "@btdrawer/divelog-server-utils";
import { isGroupParticipant } from "./middleware";

const { newMessageSubscriptionKey } = subscriptionKeys;

const newMessage = {
    subscribe: combineResolvers(
        isGroupParticipant,
        async (parent, { id }, { pubsub }) => {
            if (!pubsub) {
                throw new Error("No PubSub found.");
            }
            return pubsub.asyncIterator(newMessageSubscriptionKey(id));
        }
    )
};

export default {
    newMessage
}
