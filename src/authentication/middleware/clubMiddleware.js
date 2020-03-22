const ClubModel = require("../../models/ClubModel");
const {
    FORBIDDEN,
    NOT_FOUND,
    INVALID_ARGUMENT_ONLY_MANAGER
} = require("../../constants/errorCodes");
const { getUserId } = require("../authUtils");
const { UPDATE, DELETE } = require("../../constants/methods");

module.exports = async ({
    method,
    clubId,
    request,
    removingManagers = false
}) => {
    if (method === UPDATE || method === DELETE) {
        const userId = getUserId(request);
        const club = await ClubModel.findOne({
            _id: clubId
        });
        if (!club) {
            throw new Error(NOT_FOUND);
        }
        if (!club.managers.includes(userId)) {
            throw new Error(FORBIDDEN);
        }
        if (removingManagers && club.managers.length < 2) {
            throw new Error(INVALID_ARGUMENT_ONLY_MANAGER);
        }
    }
    return undefined;
};
