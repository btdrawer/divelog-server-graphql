const userQueries = require("./queries/userQueries");
const diveQueries = require("./queries/diveQueries");
const clubQueries = require("./queries/clubQueries");
const gearQueries = require("./queries/gearQueries");
const groupQueries = require("./queries/groupQueries");

module.exports = {
    ...userQueries,
    ...diveQueries,
    ...clubQueries,
    ...gearQueries,
    ...groupQueries
};
