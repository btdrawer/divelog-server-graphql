const GearModel = require("../../models/GearModel");
const { NOT_FOUND, FORBIDDEN } = require("../../constants/errorCodes");
const { getUserId } = require("../authUtils");
const { UPDATE, DELETE } = require("../../constants/methods");

module.exports = async ({ method, gearId, request }) => {
    if (method === UPDATE || method === DELETE) {
        const userId = getUserId(request);
        const gear = await GearModel.findOne({
            _id: gearId
        });
        if (!gear) {
            throw new Error(NOT_FOUND);
        }
        if (!gear.owner === userId) {
            throw new Error(FORBIDDEN);
        }
    }
    return undefined;
};
