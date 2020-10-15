import * as userQueries from "./queries/userQueries";
import * as diveQueries from "./queries/diveQueries";
import * as clubQueries from "./queries/clubQueries";
import * as gearQueries from "./queries/gearQueries";
import * as groupQueries from "./queries/groupQueries";

export default {
    ...userQueries,
    ...diveQueries,
    ...clubQueries,
    ...gearQueries,
    ...groupQueries
};
