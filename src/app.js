const server = require("./server");

require("./services/db");
require("./services/cache");

server()
    .listen({
        port: process.env.SERVER_PORT
    })
    .then(({ url }) => console.log(`Server listening on ${url}.`));
