const GearModel = require("../../models/gear");
const { NOT_FOUND, FORBIDDEN } = require("../../variables/errorKeys");

module.exports = async (req, data) => {
  if (req.method !== "POST" && req.params.id) {
    const gear = await GearModel.findOne({
      _id: req.params.id
    });

    if (!gear) {
      throw new Error(NOT_FOUND);
    } else if (gear.owner.toString() !== data._id.toString()) {
      throw new Error(FORBIDDEN);
    }
  }
};
