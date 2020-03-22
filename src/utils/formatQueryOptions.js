module.exports = ({ sortBy, sortOrder, limit, skip }) => ({
    sort: {
        [sortBy]: sortOrder === "DESC" ? -1 : 1
    },
    limit,
    skip
});
