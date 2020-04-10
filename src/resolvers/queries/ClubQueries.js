const ClubModel = require("../../models/ClubModel");
const { formatQueryOptions, removeFalseyProps } = require("../../utils");

module.exports = {
    clubs: (parent, { where, ...args }) =>
        ClubModel.find(
            removeFalseyProps({
                ...where
            }),
            null,
            formatQueryOptions(args)
        )
};
