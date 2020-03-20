module.exports = Object.keys(require("./errorCodes")).reduce((keys, code) => {
  keys[code] = code;
  return keys;
}, {});
