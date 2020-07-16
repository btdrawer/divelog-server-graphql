const Server = require("../../src/server");

exports.globalSetup = async done => {
    const server = await Server.build();

    global.server = server;

    process.on("SIGTERM", server.close);
    process.on("SIGINT", server.close);

    server.launch();

    done();
};

exports.globalTeardown = done => {
    global.server.close();
    done();
};
