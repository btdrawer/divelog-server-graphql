const jwt = require("jsonwebtoken");
const { INVALID_AUTH } = require("../constants/errorCodes");

const getAuthData = (req, isSubscription = false, authIsRequired = true) => {
    const header = isSubscription
        ? req.connection.context.Authorization
        : req.req.headers.authorization;
    if (!header && authIsRequired) throw new Error(INVALID_AUTH);

    if (header) {
        const token = header.replace("Bearer ", "");
        const data = jwt.verify(token, process.env.JWT_KEY);

        return { token, data };
    }

    return null;
};

const getUserId = (req, isSubscription = false, authIsRequired = true) => {
    const authData = getAuthData(req, isSubscription, authIsRequired);
    return authData ? authData.data._id : null;
};

const signJwt = id =>
    jwt.sign({ _id: id }, process.env.JWT_KEY, {
        expiresIn: "3h"
    });

module.exports = {
    getAuthData,
    getUserId,
    signJwt
};
