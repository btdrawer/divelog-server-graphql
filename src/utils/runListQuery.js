const {
    convertStringToBase64,
    convertBase64ToString
} = require("./base64Utils");

const generateCursor = ({ sortBy, sortOrder, value }) =>
    convertStringToBase64(
        JSON.stringify({
            sortBy,
            sortOrder,
            value
        })
    );

const parseCursor = cursor => JSON.parse(convertBase64ToString(cursor));

const generateQueryFromCursor = ({ sortBy, sortOrder, value }) => {
    const cursorDirection = sortOrder === "DESC" ? "$lt" : "$gt";
    return {
        [sortBy]: {
            [cursorDirection]: value
        }
    };
};

const formatWhere = ({ where, requiredArgs }) => {
    let newWhere = { ...where };
    for (let prop in newWhere) {
        if (!newWhere[prop]) delete newWhere[prop];
    }
    if (newWhere.id) {
        newWhere._id = newWhere.id;
        delete newWhere.id;
    }
    newWhere = {
        ...newWhere,
        ...requiredArgs
    };
    return newWhere;
};

const formatQueryOptions = ({ sortBy, sortOrder, limit }) => ({
    sort: {
        [sortBy]: sortOrder === "DESC" ? -1 : 1
    },
    limit: limit + 1
});

const useCache = async ({
    requiredArgs,
    hashKeyArg,
    queryProps: { model, filter, options }
}) => {
    const hashKey =
        requiredArgs && hashKeyArg ? requiredArgs[hashKeyArg] : null;
    const result = hashKey
        ? await model.find(filter, null, options).cache({
              hashKey
          })
        : await model.find(filter, null, options);
    return result;
};

module.exports = async ({ model, args, requiredArgs, hashKeyArg = null }) => {
    const { where, limit = 10, cursor } = args;
    let { sortBy = "_id", sortOrder = "ASC" } = args;
    let result;
    if (cursor) {
        const parsedCursor = parseCursor(cursor);
        sortBy = parsedCursor.sortBy;
        sortOrder = parsedCursor.sortOrder;
        result = await useCache({
            requiredArgs,
            hashKeyArg,
            queryProps: {
                model,
                filter: {
                    ...generateQueryFromCursor(parsedCursor),
                    ...requiredArgs
                },
                options: {
                    limit: limit + 1
                }
            }
        });
    } else {
        result = await useCache({
            requiredArgs,
            hashKeyArg,
            queryProps: {
                model,
                filter: formatWhere({ where, requiredArgs }),
                options: formatQueryOptions({ sortBy, sortOrder, limit })
            }
        });
    }
    const hasNextPage = result.length > limit;
    result = hasNextPage ? result.slice(0, -1) : result;
    return {
        data: result,
        pageInfo: {
            hasNextPage,
            cursor: hasNextPage
                ? generateCursor({
                      sortBy,
                      sortOrder,
                      value: result[result.length - 1][sortBy]
                  })
                : null
        }
    };
};
