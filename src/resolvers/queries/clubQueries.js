const { models, resources } = require("@btdrawer/divelog-server-utils");
const { ClubModel } = models;
const { CLUB } = resources;
const runListQuery = require("../../utils/runListQuery");

module.exports = {
    clubs: (parent, args) =>
        runListQuery({
            model: ClubModel,
            args,
            hashKey: CLUB
        }),
    club: (parent, { id }) => ClubModel.findById(id)
};
