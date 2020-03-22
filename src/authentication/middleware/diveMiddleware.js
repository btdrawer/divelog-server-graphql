const DiveModel = require("../../models/DiveModel");
const { getUserId } = require("../../authentication/authUtils");
const { NOT_FOUND, FORBIDDEN } = require("../../constants/errorCodes");
const { UPDATE, DELETE } = require("../../constants/methods");

module.exports = async ({ method, diveId, request }) => {
    if (method === UPDATE || method === DELETE) {
        const userId = getUserId(request);
        const dive = await DiveModel.findOne({
            _id: diveId
        });
        if (!dive) {
            throw new Error(NOT_FOUND);
        }
        if (!dive.user === userId) {
            throw new Error(FORBIDDEN);
        }
    }
    return undefined;
};
