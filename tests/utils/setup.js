const Server = require("../../src/Server").default;

exports.setup = async done => {
    global.server = await Server.build();
    await global.server.launch();
    done();
};

exports.teardown = async done => {
    await global.server.close();
    done();
};
