const { GroupModel } = require("@btdrawer/divelog-server-utils").models;
const hasAccess = require("../../utils/hasAccess");

module.exports = {
    isGroupParticipant: hasAccess({
        model: GroupModel,
        predicate: (group, authUserId) =>
            group.participants.includes(authUserId)
    })
};
