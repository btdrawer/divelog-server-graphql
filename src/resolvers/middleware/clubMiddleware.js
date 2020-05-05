const { skip } = require("graphql-resolvers");
const { models, errorCodes } = require("@btdrawer/divelog-server-utils");
const { ClubModel } = models;
const { NOT_FOUND, FORBIDDEN } = errorCodes;

module.exports = {
    isClubManager: async (parent, { id }, { authUserId }) => {
        const club = await ClubModel.findById(id);
        if (!club) {
            throw new Error(NOT_FOUND);
        }
        if (!club.managers.includes(authUserId)) {
            throw new Error(FORBIDDEN);
        }
        return skip;
    },
    isClubMember: async (parent, { id }, { authUserId }) => {
        const club = await ClubModel.findById(id);
        if (!club) {
            throw new Error(NOT_FOUND);
        }
        if (!club.members.includes(authUserId)) {
            throw new Error(FORBIDDEN);
        }
        return skip;
    }
};
