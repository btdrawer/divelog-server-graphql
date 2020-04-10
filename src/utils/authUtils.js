const jwt = require("jsonwebtoken");

const getAuthData = req => {
    if (req) {
        const header = req.connection
            ? req.connection.context.Authorization
            : req.req.headers.authorization;

        if (header) {
            const token = header.replace("Bearer ", "");
            const data = jwt.verify(token, process.env.JWT_KEY);

            return { token, data };
        }
    }

    return null;
};

const getUserId = req => {
    const authData = getAuthData(req);
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
