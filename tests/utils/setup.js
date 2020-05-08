const services = require("../../src/services");

exports.globalSetup = async () => {
    const { server, db, redisClient } = await services();

    global.httpServer = server;
    global.db = db;
    global.redisClient = redisClient;

    server
        .listen({
            port: process.env.SERVER_PORT
        })
        .then(({ url }) => console.log(`Server started on ${url}.`));
    return undefined;
};

exports.globalTeardown = async () => {
    await global.httpServer.stop();
    await global.db.close();
};
