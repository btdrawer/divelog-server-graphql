const { skip } = require("graphql-resolvers");
const { models, errorCodes } = require("@btdrawer/divelog-server-utils");
const { GearModel } = models;
const { NOT_FOUND } = errorCodes;

module.exports = {
    isGearOwner: async (parent, { id }, { authUserId }) => {
        const gear = await GearModel.findOne({
            _id: id,
            owner: authUserId
        });
        if (!gear) {
            throw new Error(NOT_FOUND);
        }
        return skip;
    }
};
