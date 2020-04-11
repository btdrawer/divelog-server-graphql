const ClubModel = require("../../models/ClubModel");
const runListQuery = require("../../utils/runListQuery");

module.exports = {
    clubs: (parent, args) =>
        runListQuery({
            model: ClubModel,
            args
        }),
    club: (parent, { id }) => ClubModel.findById(id)
};
