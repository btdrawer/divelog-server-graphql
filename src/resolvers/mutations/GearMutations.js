const GearModel = require("../../models/GearModel");
const { getUserId } = require("../../authentication/authUtils");
const gearMiddleware = require("../../authentication/middleware/gearMiddleware");
const { UPDATE, DELETE } = require("../../constants/methods");

module.exports = {
  createGear: async (parent, { data }, { request }) => {
    const userId = getUserId(request);
    console.log({
      ...data,
      owner: userId
    });
    const gear = new GearModel({
      ...data,
      owner: userId
    });
    await gear.save();
    return gear;
  },
  updateGear: async (parent, { id, data }, { request }) => {
    await gearMiddleware({
      method: UPDATE,
      gearId: id,
      request
    });
    return GearModel.findOneAndUpdate(
      {
        _id: id
      },
      data,
      { new: true }
    );
  },
  deleteGear: async (parent, { id }, { request }) => {
    await gearMiddleware({
      method: DELETE,
      gearId: id,
      request
    });
    return GearModel.findOneAndDelete({
      _id: id
    });
  }
};
