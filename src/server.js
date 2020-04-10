const { ApolloServer } = require("apollo-server");
const { importSchema } = require("graphql-import");
const { makeExecutableSchema } = require("graphql-tools");

const { getUserId } = require("./utils/authUtils");

const Query = require("./resolvers/Query");
const Mutation = require("./resolvers/Mutation");
const Subscription = require("./resolvers/Subscription");

const Dive = require("./resolvers/types/Dive");
const User = require("./resolvers/types/User");
const Club = require("./resolvers/types/Club");
const Group = require("./resolvers/types/Group");

const executableSchema = makeExecutableSchema({
    typeDefs: importSchema("src/schema.graphql"),
    resolvers: {
        Query,
        Mutation,
        Subscription,
        User,
        Club,
        Dive,
        Group
    }
});

module.exports = ({ context = {} } = {}) =>
    new ApolloServer({
        schema: executableSchema,
        context: request => ({
            authUserId: getUserId(request),
            ...context
        })
    });
