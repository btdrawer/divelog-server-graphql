const DiveModel = require("../../models/DiveModel");
const { getUserId } = require("../../authentication/authUtils");
const removeFalseyProps = require("../../utils/removeFalseyProps");
const formatQueryOptions = require("../../utils/formatQueryOptions");

module.exports = {
  dives: (parent, { userId, where, ...args }) => {
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
      formatQueryOptions(args)
    );
  },
  myDives: (parent, { where, ...args }, { request }) => {
    const userId = getUserId(request);
    return DiveModel.find(
      {
        user: userId,
        ...removeFalseyProps({
          ...where
        })
      },
      null,
      formatQueryOptions(args)
    );
  }
};
