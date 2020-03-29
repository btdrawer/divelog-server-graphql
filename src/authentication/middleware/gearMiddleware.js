const GearModel = require("../../models/GearModel");
const { NOT_FOUND } = require("../../constants/errorCodes");
const { getUserId } = require("../authUtils");
const { UPDATE, DELETE } = require("../../constants/methods");

module.exports = async ({ method, gearId, request }) => {
    if (method === UPDATE || method === DELETE) {
        const userId = getUserId(request);
        const gear = await GearModel.findOne({
            _id: gearId,
            owner: userId
        });
        if (!gear) {
            throw new Error(NOT_FOUND);
        }
    }
    return undefined;
};
