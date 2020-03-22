const { newMessageSubscriptionKey } = require("../constants/subscriptionKeys");
const groupMiddleware = require("../authentication/middleware/groupMiddleware");

module.exports = {
    newMessage: {
        subscribe: async (parent, { groupId }, { request, pubsub }) => {
            await groupMiddleware({ groupId, request, isSubscription: true });
            return pubsub.asyncIterator(newMessageSubscriptionKey(groupId));
        }
    }
};
