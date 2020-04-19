const redisClient = require("../services/redisClient");

exports.cleanCache = hashKey => redisClient.del(hashKey);
