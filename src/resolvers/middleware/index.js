const { skip } = require("graphql-resolvers");

const diveMiddleware = require("./diveMiddleware");
const clubMiddleware = require("./clubMiddleware");
const gearMiddleware = require("./gearMiddleware");
const groupMiddleware = require("./groupMiddleware");

const redisClient = require("../../services/redisClient");
const { CLUB } = require("../../constants/resources");
const { INVALID_AUTH } = require("../../constants/errorCodes");
const { generateUserHashKey, generateGroupHashKey } = require("../../utils");

module.exports = {
    isAuthenticated: (parent, args, { authUserId }) => {
        if (!authUserId) {
            throw new Error(INVALID_AUTH);
        }
        return skip;
    },
    clearUserCache: (parent, args, { authUserId }) => {
        redisClient.del(generateUserHashKey(authUserId));
        return skip;
    },
    clearClubCache: async () => {
        const cache = await redisClient.hget(CLUB);
        console.log("CACHE", cache);
        redisClient.del(CLUB);
        return skip;
    },
    clearGroupCache: (parent, { id }) => {
        redisClient.del(generateGroupHashKey(id));
        return skip;
    },
    ...diveMiddleware,
    ...clubMiddleware,
    ...gearMiddleware,
    ...groupMiddleware
};
