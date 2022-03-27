// @ts-check
require("dotenv").config();
const { ApolloServer } = require("apollo-server-lambda");
const { typeDefs, resolvers } = require("./schema");

require("./database");

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const serverHandler = server.createHandler();

exports.handler = (event, context, callback) => {
  return serverHandler(
    {
      ...event,
      requestContext: event.requestContext || {},
    },
    context,
    callback
  );
};
