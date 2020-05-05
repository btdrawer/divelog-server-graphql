const { combineResolvers } = require("graphql-resolvers");
const { NO_PUBSUB } = require("@btdrawer/divelog-server-utils").errorCodes;
const { newMessageSubscriptionKey } = require("../utils/subscriptionKeys");
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
