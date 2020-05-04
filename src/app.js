const { db, cache } = require("@btdrawer/divelog-server-utils");
const server = require("./server");

db();
cache();

server()
    .listen({
        port: process.env.SERVER_PORT
    })
    .then(({ url }) => console.log(`Server listening on ${url}.`));
