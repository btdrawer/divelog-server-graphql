const GearModel = require("../../models/GearModel");
const { getUserId } = require("../../authentication/authUtils");
const removeFalseyProps = require("../../utils/removeFalseyProps");
const formatQueryOptions = require("../../utils/formatQueryOptions");

module.exports = {
  gear: async (parent, { where, ...args }, { request }) => {
    const userId = getUserId(request);
    return GearModel.find(
      {
        owner: userId,
        ...removeFalseyProps({
          ...where
        })
      },
      null,
      formatQueryOptions(args)
    );
  }
};
