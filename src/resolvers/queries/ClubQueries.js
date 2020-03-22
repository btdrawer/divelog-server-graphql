const ClubModel = require("../../models/ClubModel");
const removeFalseyProps = require("../../utils/removeFalseyProps");
const formatQueryOptions = require("../../utils/formatQueryOptions");

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
