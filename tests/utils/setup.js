const getServer = require("../../src/server");

exports.globalSetup = async done => {
    const { server, closeServer } = await getServer();

    global.httpServer = server;
    global.closeServer = closeServer;

    server
        .listen({
            port: process.env.SERVER_PORT
        })
        .then(({ url }) => console.log(`Server started on ${url}.`));

    done();
};

exports.globalTeardown = done => {
    global.closeServer();
    done();
};
