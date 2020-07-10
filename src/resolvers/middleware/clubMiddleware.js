const { ClubModel } = require("@btdrawer/divelog-server-utils").models;
const hasAccess = require("../../utils/hasAccess");

module.exports = {
    isClubManager: hasAccess({
        model: ClubModel,
        predicate: (club, authUserId) => club.managers.includes(authUserId)
    }),
    isClubMember: hasAccess({
        model: ClubModel,
        predicate: (club, authUserId) => club.members.includes(authUserId)
    })
};
