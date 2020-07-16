const Server = require("./Server");

(async () => {
    const server = await Server.build();

    process.on("SIGTERM", server.close);
    process.on("SIGINT", server.close);

    server.launch();
})();
