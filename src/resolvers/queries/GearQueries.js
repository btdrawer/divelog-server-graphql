const GearModel = require("../../models/GearModel");
const { getUserId } = require("../../authentication/authUtils");
const removeFalseyProps = require("../../utils/removeFalseyProps");

module.exports = {
  gear: async (parent, { where, limit, skip }, { request }) => {
    const userId = getUserId(request);
    return GearModel.find(
      {
        owner: userId,
        ...removeFalseyProps({
          ...where
        })
      },
      null,
      { limit, skip }
    );
  }
};
