const { skip } = require("graphql-resolvers");
const {
    NOT_FOUND,
    FORBIDDEN
} = require("@btdrawer/divelog-server-utils").errorCodes;

module.exports = ({ model, predicate }) => async (
    parent,
    { id },
    { authUserId }
) => {
    const result = await model.findById(id);
    if (!result) {
        throw new Error(NOT_FOUND);
    }
    if (!predicate(result, authUserId)) {
        throw new Error(FORBIDDEN);
    }
    return skip;
};
