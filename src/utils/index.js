const formatAuthPayload = result => ({
    user: {
        id: result._id,
        name: result.name,
        username: result.username,
        email: result.email
    },
    token: result.token
});

module.exports = {
    formatAuthPayload
};
