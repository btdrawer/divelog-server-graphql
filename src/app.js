const { GraphQLServer } = require("graphql-yoga");

// Launch database
require("./db");

// Resolvers
const Query = require("./resolvers/Query");
const Mutation = require("./resolvers/Mutation");
const User = require("./resolvers/types/User");
const Club = require("./resolvers/types/Club");

const server = new GraphQLServer({
  typeDefs: "./src/schema.graphql",
  resolvers: {
    Query,
    Mutation,
    User,
    Club
  },
  context: request => request
});

const options = {
  port: process.env.PORT,
  endpoint: "/graphql"
};

server.start(options, () => "Server listening");
