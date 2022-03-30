// @ts-check
require("dotenv").config();
const { ApolloServer } = require("apollo-server-lambda");
const {
  ApolloServerPluginLandingPageDisabled,
  ApolloServerPluginLandingPageGraphQLPlayground,
} = require("apollo-server-core");
// const express = require("express");
// const verify = require("./utils/verifyToken");

const { typeDefs, resolvers } = require("./schema");
require("./database");

const server = new ApolloServer({
  typeDefs,
  resolvers,
  plugins: [
    process.env.NODE_ENV === "production"
      ? ApolloServerPluginLandingPageDisabled()
      : ApolloServerPluginLandingPageGraphQLPlayground(),
  ],
  // @ts-ignore
  context: () => {}
});

const serverHandler = server.createHandler({
  // expressAppFromMiddleware: (middleware) => {
  //   const app = express();
  //   app.use(middleware);
  //   app.use(verify);
  //   return app;
  // }
});

// exports.handler = (event, context, callback) => {
//   return serverHandler(
//     {
//       ...event,
//       requestContext: event.requestContext || {},
//     },
//     context,
//     callback
//   );
// };
