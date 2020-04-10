const { skip } = require("graphql-resolvers");

const DiveModel = require("../../models/DiveModel");
const { NOT_FOUND } = require("../../constants/errorCodes");

module.exports = {
    isDiveUser: async (parent, { id }, { authUserId }) => {
        const dive = await DiveModel.findOne({
            _id: id,
            user: authUserId
        });
        if (!dive) {
            throw new Error(NOT_FOUND);
        }
        return skip;
    }
};
