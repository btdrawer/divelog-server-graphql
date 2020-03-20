const ClubModel = require("../../models/ClubModel");
const removeFalseyProps = require("../../utils/removeFalseyProps");

module.exports = {
  clubs: (parent, { name, location, limit, skip }) =>
    ClubModel.find(
      removeFalseyProps({
        name,
        location
      }),
      null,
      { limit, skip }
    )
};
