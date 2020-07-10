const { GearModel } = require("@btdrawer/divelog-server-utils").models;
const hasAccess = require("../../utils/hasAccess");

module.exports = {
    isGearOwner: hasAccess({
        model: GearModel,
        predicate: (gear, authUserId) => gear.owner.toString() === authUserId
    })
};
