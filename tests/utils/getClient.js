const ApolloClient = require("apollo-boost").default;
const fetch = require("node-fetch");

module.exports = jwt =>
    new ApolloClient({
        uri: `http://localhost:${process.env.SERVER_PORT}`,
        request: operation => {
            if (jwt) {
                operation.setContext({
                    headers: {
                        Authorization: `Bearer ${jwt}`
                    }
                });
            }
        },
        fetch
    });
