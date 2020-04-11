const { skip } = require("graphql-resolvers");

const diveMiddleware = require("./diveMiddleware");
const clubMiddleware = require("./clubMiddleware");
const gearMiddleware = require("./gearMiddleware");
const groupMiddleware = require("./groupMiddleware");

const { INVALID_AUTH } = require("../../constants/errorCodes");

module.exports = {
    isAuthenticated: (parent, args, { authUserId }) => {
        if (!authUserId) {
            throw new Error(INVALID_AUTH);
        }
        return skip;
    },
    ...diveMiddleware,
    ...clubMiddleware,
    ...gearMiddleware,
    ...groupMiddleware
};
