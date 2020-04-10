const { combineResolvers } = require("graphql-resolvers");

const { newMessageSubscriptionKey } = require("../constants/subscriptionKeys");
const { isGroupParticipant } = require("./middleware");
const { NO_PUBSUB } = require("../constants/errorCodes");

module.exports = {
    newMessage: {
        subscribe: combineResolvers(
            isGroupParticipant,
            async (parent, { groupId }, { pubsub }) => {
                if (!pubsub) {
                    throw new Error(NO_PUBSUB);
                }
                return pubsub.asyncIterator(newMessageSubscriptionKey(groupId));
            }
        )
    }
};
