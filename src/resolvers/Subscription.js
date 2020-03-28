const { newMessageSubscriptionKey } = require("../constants/subscriptionKeys");
const groupMiddleware = require("../authentication/middleware/groupMiddleware");
const { NO_PUBSUB } = require("../constants/errorCodes");

module.exports = {
    newMessage: {
        subscribe: async (parent, { groupId }, { request, pubsub }) => {
            if (!pubsub) {
                throw new Error(NO_PUBSUB);
            }
            await groupMiddleware({ groupId, request, isSubscription: true });
            return pubsub.asyncIterator(newMessageSubscriptionKey(groupId));
        }
    }
};
