const server = require("../../src/server");
require("../../src/services/db");
require("../../src/services/cache");

module.exports = async () => {
    global.httpServer = server();
    await global.httpServer
        .listen({
            port: process.env.SERVER_PORT
        })
        .then(({ url }) => console.log(`Server started on ${url}.`));
};
