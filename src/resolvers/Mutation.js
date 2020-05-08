const userMutations = require("./mutations/userMutations");
const diveMutations = require("./mutations/diveMutations");
const clubMutations = require("./mutations/clubMutations");
const gearMutations = require("./mutations/gearMutations");
const groupMutations = require("./mutations/groupMutations");

module.exports = {
    ...userMutations,
    ...diveMutations,
    ...clubMutations,
    ...gearMutations,
    ...groupMutations
};
