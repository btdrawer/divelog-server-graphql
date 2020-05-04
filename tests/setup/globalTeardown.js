module.exports = async () => {
    await global.httpServer.stop();
    await global.db.close();
};
