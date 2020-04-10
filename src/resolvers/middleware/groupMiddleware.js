const { skip } = require("graphql-resolvers");

const GroupModel = require("../../models/GroupModel");
const { NOT_FOUND, FORBIDDEN } = require("../../constants/errorCodes");

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
