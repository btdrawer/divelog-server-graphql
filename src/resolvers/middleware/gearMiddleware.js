const { skip } = require("graphql-resolvers");

const GearModel = require("../../models/GearModel");
const { NOT_FOUND } = require("../../constants/errorCodes");

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
