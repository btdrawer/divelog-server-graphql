const jwt = require("jsonwebtoken");
require("dotenv").config();

const getAuthData = req => {
    if (req) {
        const header = req.connection
            ? req.connection.context.Authorization
            : req.req.headers.authorization;

        if (header) {
            const token = header.replace("Bearer ", "");
            const data = jwt.verify(token, process.env.JWT_KEY);

            return data;
        }
    }
    return null;
};

module.exports = req => {
    const authData = getAuthData(req);
    return authData ? authData.id : null;
};
