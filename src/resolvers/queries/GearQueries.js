const GearModel = require("../../models/GearModel");
const { getUserId } = require("../../authentication/authUtils");

module.exports = {
  gear: async (parent, { limit, skip }, { request }) => {
    const userId = getUserId(request);
    return GearModel.find(
      {
        owner: userId
      },
      null,
      { limit, skip }
    );
  }
};
