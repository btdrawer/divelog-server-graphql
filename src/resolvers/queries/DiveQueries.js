const DiveModel = require("../../models/DiveModel");
const { getUserId } = require("../../authentication/authUtils");
const removeFalseyProps = require("../../utils/removeFalseyProps");

module.exports = {
  dives: (parent, { userId, where, limit, skip }) => {
    if (where) {
      if (where.public) delete where.public;
    }
    return DiveModel.find(
      {
        user: userId,
        public: true,
        ...removeFalseyProps({
          ...where
        })
      },
      null,
      { limit, skip }
    );
  },
  myDives: (parent, { where, limit, skip }, { request }) => {
    const userId = getUserId(request);
    return DiveModel.find(
      {
        user: userId,
        ...removeFalseyProps({
          ...where
        })
      },
      null,
      { limit, skip }
    );
  }
};
