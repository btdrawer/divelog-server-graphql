const DiveModel = require("../../models/DiveModel");
const UserModel = require("../../models/UserModel");
const { getUserId } = require("../../authentication/authUtils");
const diveMiddleware = require("../../authentication/middleware/diveMiddleware");
const { UPDATE, DELETE } = require("../../constants/methods");

const updateOperationTemplate = async ({ diveId, data, request }) => {
  await diveMiddleware({
    update: UPDATE,
    diveId,
    request
  });
  return DiveModel.findOneAndUpdate(
    {
      _id: diveId
    },
    data,
    { new: true }
  );
};

module.exports = {
  createDive: async (parent, { data }, { request }) => {
    const userId = getUserId(request);
    const dive = new DiveModel({
      ...data,
      user: userId
    });
    await dive.save();
    await UserModel.findOneAndUpdate(
      {
        _id: userId
      },
      {
        $push: {
          dives: dive.id
        }
      }
    );
    return dive;
  },
  updateDive: (parent, { id, data }, { request }) =>
    updateOperationTemplate({
      diveId: id,
      data,
      request
    }),
  addGearToDive: (parent, { diveId, gearId }, { request }) =>
    updateOperationTemplate({
      diveId,
      data: {
        $push: {
          gear: gearId
        }
      },
      request
    }),
  removeGearFromDive: (parent, { diveId, gearId }, { request }) =>
    updateOperationTemplate({
      diveId,
      data: {
        $pull: {
          gear: gearId
        }
      },
      request
    }),
  addBuddyToDive: (parent, { diveId, buddyId }, { request }) =>
    updateOperationTemplate({
      diveId,
      data: {
        $push: {
          buddies: buddyId
        }
      },
      request
    }),
  removeBuddyFromDive: (parent, { diveId, buddyId }, { request }) =>
    updateOperationTemplate({
      diveId,
      data: {
        $pull: {
          buddies: buddyId
        }
      },
      request
    }),
  deleteDive: async (parent, { id }, { request }) => {
    const userId = getUserId(request);
    await diveMiddleware({
      method: DELETE,
      diveId: id,
      request
    });
    const dive = await DiveModel.findOneAndDelete({
      _id: id
    });
    await UserModel.findOneAndUpdate(
      {
        _id: userId
      },
      {
        $pull: {
          dives: dive.id
        }
      }
    );
    return dive;
  }
};
