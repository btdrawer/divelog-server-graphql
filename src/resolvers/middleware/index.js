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
    clearUserCache: (parent, args, { cacheFunctions, authUserId }) => {
        cacheFunctions.clearCache(generateUserHashKey(authUserId));
        return skip;
    },
    clearClubCache: (parent, args, { cacheFunctions }) => {
        cacheFunctions.clearCache(CLUB);
        return skip;
    },
    clearGroupCache: (parent, { id }, { cacheFunctions }) => {
        cacheFunctions.clearCache(generateGroupHashKey(id));
        return skip;
    },
    ...diveMiddleware,
    ...clubMiddleware,
    ...gearMiddleware,
    ...groupMiddleware
};
