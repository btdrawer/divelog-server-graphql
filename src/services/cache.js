const mongoose = require("mongoose");
const redisClient = require("./redisClient");

const exec = mongoose.Query.prototype.exec;

mongoose.Query.prototype.cache = async function(options = {}) {
    this.useCache = true;
    this.hashKey = options.hashKey || "";
    return this;
};

mongoose.Query.prototype.exec = async function() {
    if (!this.useCache) {
        return exec.apply(this, arguments);
    }
    const key = JSON.stringify({
        ...this.getQuery(),
        name: this.mongooseCollection.name
    });
    const cachedData = await redisClient.hget(this.hashKey, key);
    if (cachedData) {
        const parsedCachedData = JSON.parse(cachedData);
        return Array.isArray(parsedCachedData)
            ? parsedCachedData.map(elem => new this.model(elem))
            : new this.model(parsedCachedData);
    }
    const data = await exec.apply(this, arguments);
    redisClient.hset(this.hashKey, key, JSON.stringify(data));
    return data;
};
