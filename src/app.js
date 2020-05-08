const services = require("./services");

const app = async () => {
    const { server } = await services();
    server
        .listen({
            port: process.env.SERVER_PORT
        })
        .then(({ url }) => console.log(`Server listening on ${url}.`));
};

app();
