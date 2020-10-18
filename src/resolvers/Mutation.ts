import * as userMutations from "./mutations/userMutations";
import * as diveMutations from "./mutations/diveMutations";
import * as clubMutations from "./mutations/clubMutations";
import * as gearMutations from "./mutations/gearMutations";
import * as groupMutations from "./mutations/groupMutations";

export default {
    ...userMutations,
    ...diveMutations,
    ...clubMutations,
    ...gearMutations,
    ...groupMutations
};
