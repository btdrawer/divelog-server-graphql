import ApolloClient from "apollo-boost";
import "cross-fetch/polyfill";

const getClient = (jwt?: string) =>
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
        }
    });

export default getClient;
