const { getUserId } = require("../../authentication/authUtils");
const ClubModel = require("../../models/ClubModel");
const GearModel = require("../../models/GearModel");

module.exports = {
  email: ({ id, email }, args, { request }) => {
    const userId = getUserId(request);
    if (userId && userId === id) {
      return email;
    }
    return undefined;
  },
  clubs: async ({ clubs }) => {
    // TODO run these promises simultaneously
    const manager = await ClubModel.find({
      _id: {
        $in: clubs.manager
      }
    });
    const member = await ClubModel.find({
      _id: {
        $in: clubs.member
      }
    });
    return {
      manager,
      member
    };
  },
  gear: ({ id, gear }, args, { request }) => {
    const userId = getUserId(request);
    if (userId && userId === id) {
      return GearModel.find({
        _id: {
          $in: gear
        }
      });
    }
    return undefined;
  }
};
