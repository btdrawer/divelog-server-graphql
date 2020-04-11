const { skip } = require("graphql-resolvers");

const DiveModel = require("../../models/DiveModel");
const { NOT_FOUND, FORBIDDEN } = require("../../constants/errorCodes");

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
    },
    isUserOrDiveIsPublic: async (parent, { id }, { authUserId }) => {
        const dive = await DiveModel.findOne({
            _id: id
        });
        if (!dive) {
            throw new Error(NOT_FOUND);
        }
        if (dive.user.toString() !== authUserId && !dive.public) {
            throw new Error(FORBIDDEN);
        }
        return skip;
    }
};
