const GearModel = require("../../models/GearModel");
const UserModel = require("../../models/UserModel");
const { getUserId } = require("../../authentication/authUtils");
const gearMiddleware = require("../../authentication/middleware/gearMiddleware");
const { UPDATE, DELETE } = require("../../constants/methods");

module.exports = {
  createGear: async (parent, { data }, { request }) => {
    const userId = getUserId(request);
    const gear = new GearModel({
      ...data,
      owner: userId
    });
    await gear.save();
    await UserModel.findOneAndUpdate(
      {
        _id: userId
      },
      {
        $push: {
          gear: gear.id
        }
      }
    );
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
    const userId = getUserId(request);
    await gearMiddleware({
      method: DELETE,
      gearId: id,
      request
    });
    await UserModel.findOneAndUpdate(
      {
        _id: userId
      },
      {
        $pull: {
          gear: id
        }
      }
    );
    return GearModel.findOneAndDelete({
      _id: id
    });
  }
};
