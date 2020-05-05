const server = require("../../src/server");
const { db, cache } = require("@btdrawer/divelog-server-utils");

module.exports = async () => {
    global.db = db();
    cache();

    global.httpServer = server();
    await global.httpServer
        .listen({
            port: process.env.SERVER_PORT
        })
        .then(({ url }) => console.log(`Server started on ${url}.`));
};
