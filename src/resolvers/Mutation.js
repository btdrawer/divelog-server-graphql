const UserMutations = require("./mutations/UserMutations");
const ClubMutations = require("./mutations/ClubMutations");
const GearMutations = require("./mutations/GearMutations");

module.exports = {
  ...UserMutations,
  ...ClubMutations,
  ...GearMutations
};
