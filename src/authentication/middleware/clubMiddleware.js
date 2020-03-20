const ClubModel = require("../../models/ClubModel");
const { FORBIDDEN } = require("../../constants/errorKeys");
const { getUserId } = require("../authUtils");
const { UPDATE, DELETE } = require("../../constants/methods");

module.exports = async ({ method, clubId, request }) => {
  if (method === UPDATE || method === DELETE) {
    const userId = getUserId(request);
    const club = await ClubModel.findOne({
      _id: clubId
    });
    if (!club.managers.includes(userId)) {
      throw new Error(FORBIDDEN);
    }
  }
  return undefined;
};
