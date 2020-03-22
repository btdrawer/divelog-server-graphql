const UserQueries = require("./queries/UserQueries");
const DiveQueries = require("./queries/DiveQueries");
const ClubQueries = require("./queries/ClubQueries");
const GearQueries = require("./queries/GearQueries");
const GroupQueries = require("./queries/GroupQueries");

module.exports = {
    ...UserQueries,
    ...DiveQueries,
    ...ClubQueries,
    ...GearQueries,
    ...GroupQueries
};
