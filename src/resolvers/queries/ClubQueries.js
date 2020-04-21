const ClubModel = require("../../models/ClubModel");
const runListQuery = require("../../utils/runListQuery");
const { CLUB } = require("../../constants/resources");

module.exports = {
    clubs: (parent, args) =>
        runListQuery({
            model: ClubModel,
            args,
            hashKey: CLUB
        }),
    club: (parent, { id }) => ClubModel.findById(id)
};
