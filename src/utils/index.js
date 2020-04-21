const { USER, GROUP } = require("../constants/resources");

const formatAuthPayload = result => ({
    user: {
        id: result._id,
        name: result.name,
        username: result.username,
        email: result.email
    },
    token: result.token
});

const convertStringToBase64 = input => Buffer.from(input).toString("base64");

const convertBase64ToString = input =>
    Buffer.from(input, "base64").toString("ascii");

const generateUserHashKey = userId => `${USER}_${userId}`;

const generateGroupHashKey = groupId => `${GROUP}_${groupId}`;

module.exports = {
    formatAuthPayload,
    convertStringToBase64,
    convertBase64ToString,
    generateUserHashKey,
    generateGroupHashKey
};
