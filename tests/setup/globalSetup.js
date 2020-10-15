const Server = require("../../src/server").default;

module.exports = async () => {
    global.server = await Server.build();
    global.server.launch();
};
