const { convertStringToBase64, convertBase64ToString } = require("./index");

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

const filterWhereProps = where =>
    where
        ? Object.keys(where).reduce((acc, key) => {
              const value = where[key];
              if (value !== null && value !== undefined) {
                  if (key === "id") {
                      return {
                          ...acc,
                          _id: value
                      };
                  }
                  return {
                      ...acc,
                      [key]: value
                  };
              }
              return acc;
          }, {})
        : undefined;

const formatWhere = ({ where, requiredArgs }) => ({
    ...filterWhereProps(where),
    ...requiredArgs
});

const formatQueryOptions = ({ sortBy, sortOrder, limit }) => ({
    sort: {
        [sortBy]: sortOrder === "DESC" ? -1 : 1
    },
    limit: limit + 1
});

module.exports = queryWithCache => async ({
    model,
    args,
    requiredArgs,
    hashKey = null
}) => {
    const { where, limit = 10, cursor } = args;
    let { sortBy = "_id", sortOrder = "ASC" } = args;
    let filter, options;

    if (cursor) {
        const parsedCursor = parseCursor(cursor);
        sortBy = parsedCursor.sortBy;
        sortOrder = parsedCursor.sortOrder;
        filter = {
            ...generateQueryFromCursor(parsedCursor),
            ...requiredArgs
        };
        options = {
            limit: limit + 1
        };
    } else {
        filter = formatWhere({ where, requiredArgs });
        options = formatQueryOptions({ sortBy, sortOrder, limit });
    }

    let result = await queryWithCache(hashKey, {
        model,
        filter,
        options
    });

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
