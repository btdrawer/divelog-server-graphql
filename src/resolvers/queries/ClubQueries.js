const ClubModel = require("../../models/ClubModel");
const removeFalseyProps = require("../../utils/removeFalseyProps");

module.exports = {
  clubs: (parent, { where, limit, skip }) =>
    ClubModel.find(
      removeFalseyProps({
        ...where
      }),
      null,
      { limit, skip }
    )
};
