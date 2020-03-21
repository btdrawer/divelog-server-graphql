const UserQueries = require("./queries/UserQueries");
const ClubQueries = require("./queries/ClubQueries");
const GearQueries = require("./queries/GearQueries");

module.exports = {
  ...UserQueries,
  ...ClubQueries,
  ...GearQueries
};
