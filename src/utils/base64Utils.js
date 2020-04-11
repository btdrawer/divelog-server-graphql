const convertStringToBase64 = input => Buffer.from(input).toString("base64");

const convertBase64ToString = input =>
    Buffer.from(input, "base64").toString("ascii");

module.exports = {
    convertStringToBase64,
    convertBase64ToString
};
