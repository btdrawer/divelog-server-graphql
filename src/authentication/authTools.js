const jwt = require("jsonwebtoken");
const { INVALID_AUTH } = require("../variables/errorKeys");

const getAuthData = req => {
  if (!req.header("Authorization")) throw new Error(INVALID_AUTH);

  const token = req.header("Authorization").replace("Bearer ", "");
  const data = jwt.verify(token, process.env.JWT_KEY);

  return { token, data };
};

const getUserId = req => getAuthData(req).data._id;

const signJwt = id =>
  jwt.sign({ _id: id }, process.env.JWT_KEY, {
    expiresIn: "3h"
  });

module.exports = {
  getAuthData,
  getUserId,
  signJwt
};
