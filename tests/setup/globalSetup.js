const server = require("../../src/server");

module.exports = async () => {
    require("../../src/db");
    global.httpServer = server();
    await global.httpServer
        .listen({
            port: process.env.SERVER_PORT
        })
        .then(({ url }) => console.log(`Server started on ${url}.`));
};
