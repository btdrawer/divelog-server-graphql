const ClubModel = require("../../models/ClubModel");
const runListQuery = require("../../utils/runListQuery");

module.exports = {
    clubs: async (parent, args) =>
        runListQuery({
            model: ClubModel,
            args
        }),
    club: async (parent, { id }) => await ClubModel.findById(id)
};
