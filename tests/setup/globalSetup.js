const getServer = require("../../src/server");

module.exports = async () => {
    const server = getServer();
    global.httpServer = await server.listen();
};
