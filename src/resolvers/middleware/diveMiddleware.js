const { DiveModel } = require("@btdrawer/divelog-server-utils").models;
const hasAccess = require("../../utils/hasAccess");

module.exports = {
    isDiveUser: hasAccess({
        model: DiveModel,
        predicate: (dive, authUserId) => dive.user.toString() === authUserId
    }),
    isUserOrDiveIsPublic: hasAccess({
        model: DiveModel,
        predicate: (dive, authUserId) =>
            dive.user.toString() === authUserId || dive.public
    })
};
