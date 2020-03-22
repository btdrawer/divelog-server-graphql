const jwt = require("jsonwebtoken");
const { INVALID_AUTH } = require("../constants/errorCodes");

const getAuthData = (req, isSubscription = false) => {
    const header = isSubscription
        ? req.connection.context.Authorization
        : req.request.header("Authorization");
    if (!header) throw new Error(INVALID_AUTH);

    const token = header.replace("Bearer ", "");
    const data = jwt.verify(token, process.env.JWT_KEY);

    return { token, data };
};

const getUserId = (req, isSubscription = false) =>
    getAuthData(req, isSubscription).data._id;

const signJwt = id =>
    jwt.sign({ _id: id }, process.env.JWT_KEY, {
        expiresIn: "3h"
    });

module.exports = {
    getAuthData,
    getUserId,
    signJwt
};
