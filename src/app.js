const getServer = require("./server");

(async () => {
    const { server, closeServer } = await getServer();

    process.on("SIGTERM", closeServer);
    process.on("SIGINT", closeServer);

    server
        .listen({
            port: process.env.SERVER_PORT
        })
        .then(({ url }) => console.log(`Server listening on ${url}.`));
})();
