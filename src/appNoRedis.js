const getServer = require("./server");
require("./db");

const server = getServer();

server.listen().then(({ url }) => console.log(`Server listening on ${url}.`));
