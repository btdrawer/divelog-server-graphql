const ClubModel = require("../../models/ClubModel");
const { getUserId } = require("../../authentication/authUtils");
const clubMiddleware = require("../../authentication/middleware/clubMiddleware");
const { UPDATE, DELETE } = require("../../constants/methods");

const updateOperationTemplate = async ({
  clubId,
  data,
  request,
  removingManagers = false
}) => {
  await clubMiddleware({
    method: UPDATE,
    clubId,
    request,
    removingManagers
  });
  return ClubModel.findOneAndUpdate(
    {
      _id: clubId
    },
    data,
    { new: true }
  );
};

module.exports = {
  createClub: async (parent, { data }, { request }) => {
    const userId = getUserId(request);
    const club = new ClubModel({
      ...data,
      managers: [userId]
    });
    await club.save();
    return club;
  },
  updateClub: (parent, { id, data }, { request }) =>
    updateOperationTemplate({
      clubId: id,
      data,
      request
    }),
  addClubManager: (parent, { clubId, userId }, { request }) =>
    updateOperationTemplate({
      clubId,
      data: {
        $push: {
          managers: userId
        }
      },
      request
    }),
  removeClubManager: async (parent, { clubId, managerId }, { request }) =>
    updateOperationTemplate({
      clubId,
      data: {
        $pull: {
          managers: managerId
        }
      },
      request,
      removingManagers: true
    }),
  deleteClub: async (parent, { id }, { request }) => {
    await clubMiddleware({
      method: DELETE,
      clubId: id,
      request
    });
    return ClubModel.findOneAndDelete({
      _id: id
    });
  }
};
