const DiveModel = require("../../models/dive");
const { NOT_FOUND, FORBIDDEN } = require("../../variables/errorKeys");

module.exports = async (req, data) => {
  if (req.method !== "POST" && req.params.id) {
    const dive = await DiveModel.findOne({
      _id: req.params.id
    });

    if (!dive) {
      throw new Error(NOT_FOUND);
    } else if (
      dive.user.toString() !== data._id.toString() &&
      !(req.method === "GET" && dive.public)
    ) {
      throw new Error(FORBIDDEN);
    }
  }
};
