const UserMutations = require("./mutations/UserMutations");
const DiveMutations = require("./mutations/DiveMutations");
const ClubMutations = require("./mutations/ClubMutations");
const GearMutations = require("./mutations/GearMutations");

module.exports = {
  ...UserMutations,
  ...DiveMutations,
  ...ClubMutations,
  ...GearMutations
};
