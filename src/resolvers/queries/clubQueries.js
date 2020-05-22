const { models, resources } = require("@btdrawer/divelog-server-utils");
const { ClubModel } = models;
const { CLUB } = resources;

module.exports = {
    clubs: (parent, args, { runListQuery }) =>
        runListQuery({
            model: ClubModel,
            args,
            hashKey: CLUB
        }),
    club: (parent, { id }) => ClubModel.findById(id)
};
