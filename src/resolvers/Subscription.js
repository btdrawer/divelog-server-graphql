const { combineResolvers } = require("graphql-resolvers");
const {
    errorCodes,
    subscriptionKeys
} = require("@btdrawer/divelog-server-utils");
const { NO_PUBSUB } = errorCodes;
const { newMessageSubscriptionKey } = subscriptionKeys;
const { isGroupParticipant } = require("./middleware");

module.exports = {
    newMessage: {
        subscribe: combineResolvers(
            isGroupParticipant,
            async (parent, { id }, { pubsub }) => {
                if (!pubsub) {
                    throw new Error(NO_PUBSUB);
                }
                return pubsub.asyncIterator(newMessageSubscriptionKey(id));
            }
        )
    }
};
