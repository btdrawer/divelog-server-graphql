const { skip } = require("graphql-resolvers");
const { resources, errorCodes } = require("@btdrawer/divelog-server-utils");
const { CLUB } = resources;
const { INVALID_AUTH } = errorCodes;
const { generateUserHashKey, generateGroupHashKey } = require("../../utils");

const diveMiddleware = require("./diveMiddleware");
const clubMiddleware = require("./clubMiddleware");
const gearMiddleware = require("./gearMiddleware");
const groupMiddleware = require("./groupMiddleware");

module.exports = {
    isAuthenticated: (parent, args, { authUserId }) => {
        if (!authUserId) {
            throw new Error(INVALID_AUTH);
        }
        return skip;
    },
    clearUserCache: (parent, args, { redisClient, authUserId }) => {
        redisClient.del(generateUserHashKey(authUserId));
        return skip;
    },
    clearClubCache: (parent, args, { redisClient }) => {
        redisClient.del(CLUB);
        return skip;
    },
    clearGroupCache: (parent, { id }, { redisClient }) => {
        redisClient.del(generateGroupHashKey(id));
        return skip;
    },
    ...diveMiddleware,
    ...clubMiddleware,
    ...gearMiddleware,
    ...groupMiddleware
};
