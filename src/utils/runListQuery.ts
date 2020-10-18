import { convertStringToBase64, convertBase64ToString } from ".";

type Cursor = {
    sortBy: string;
    sortOrder: string;
    value: string;
};

const generateCursor = (
    sortBy: string,
    sortOrder: string,
    value: string
): string =>
    convertStringToBase64(
        JSON.stringify({
            sortBy,
            sortOrder,
            value
        })
    );

const parseCursor = (cursor: string): Cursor =>
    JSON.parse(convertBase64ToString(cursor));

const generateQueryFromCursor = (cursor: Cursor): any => {
    const cursorDirection = cursor.sortOrder === "DESC" ? "$lt" : "$gt";
    return {
        [cursor.sortBy]: {
            [cursorDirection]: cursor.value
        }
    };
};

const filterWhereProps = (where: any) =>
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

const formatWhere = (where: any, requiredArgs: any) => ({
    ...filterWhereProps(where),
    ...requiredArgs
});

const formatQueryOptions = (
    sortBy: string,
    sortOrder: string,
    limit: number
) => ({
    sort: {
        [sortBy]: sortOrder === "DESC" ? -1 : 1
    },
    limit: limit + 1
});

const runListQuery = (queryWithCache: Function) => async (
    model: any,
    args: any,
    requiredArgs: any,
    hashKey = null
) => {
    const { where, limit = 10, cursor } = args || {};
    let { sortBy = "_id", sortOrder = "ASC" } = args || {};
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
        filter = formatWhere(where, requiredArgs);
        options = formatQueryOptions(sortBy, sortOrder, limit);
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
                ? generateCursor(
                      sortBy,
                      sortOrder,
                      result[result.length - 1][sortBy]
                  )
                : null
        }
    };
};

export default runListQuery;
