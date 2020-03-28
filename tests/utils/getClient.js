const ApolloClient = require("apollo-boost").default;
const fetch = require("node-fetch");

module.exports = jwt =>
    new ApolloClient({
        uri: "http://localhost:4000/graphql",
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
