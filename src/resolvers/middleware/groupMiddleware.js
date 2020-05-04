const { skip } = require("graphql-resolvers");
const { models, errorCodes } = require("@btdrawer/divelog-server-utils");
const { GroupModel } = models;
const { NOT_FOUND, FORBIDDEN } = errorCodes;

module.exports = {
    isGroupParticipant: async (parent, { id }, { authUserId }) => {
        const group = await GroupModel.findById(id);
        if (!group) {
            throw new Error(NOT_FOUND);
        }
        if (!group.participants.includes(authUserId)) {
            throw new Error(FORBIDDEN);
        }
        return skip;
    }
};
