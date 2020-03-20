const UserMutations = require("./mutations/UserMutations");
const ClubMutations = require("./mutations/ClubMutations");

module.exports = {
  ...UserMutations,
  ...ClubMutations
};
