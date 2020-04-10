module.exports = {
    formatQueryOptions: ({ sortBy, sortOrder, limit, skip }) => ({
        sort: {
            [sortBy]: sortOrder === "DESC" ? -1 : 1
        },
        limit,
        skip
    }),
    formatAuthPayload: result => ({
        user: {
            id: result._id,
            name: result.name,
            username: result.username,
            email: result.email
        },
        token: result.token
    }),
    removeFalseyProps: obj => {
        let newObj = { ...obj };
        for (let prop in newObj) {
            if (!newObj[prop]) delete newObj[prop];
        }
        if (newObj.id) {
            newObj._id = newObj.id;
            delete newObj.id;
        }
        return newObj;
    }
};
