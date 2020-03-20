const GroupModel = require("../../models/group");
const { NOT_FOUND, FORBIDDEN } = require("../../variables/errorKeys");

module.exports = async (req, data) => {
  if (req.params.id) {
    const group = await GroupModel.findOne({
      _id: req.params.id
    });

    if (!group) {
      throw new Error(NOT_FOUND);
    } else if (!group.participants.includes(data._id.toString())) {
      throw new Error(FORBIDDEN);
    }
  }
};
