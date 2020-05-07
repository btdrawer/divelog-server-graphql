const server = require("../../src/server");

module.exports = () => {
    global.httpServer = server;
    server
        .listen({
            port: process.env.SERVER_PORT
        })
        .then(({ url }) => console.log(`Server started on ${url}.`));
};
