const UserQueries = require("./queries/UserQueries");
const ClubQueries = require("./queries/ClubQueries");

module.exports = {
  ...UserQueries,
  ...ClubQueries
};
