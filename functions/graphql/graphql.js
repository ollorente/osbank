// @ts-check
// @ts-ignore
require('dotenv').config()
const express = require('express')
// @ts-ignore
const { ApolloServer } = require('apollo-server-lambda')
// @ts-ignore
const { ApolloServerPluginLandingPageDisabled, ApolloServerPluginLandingPageGraphQLPlayground, ApolloServerPluginDrainHttpServer } = require('apollo-server-core')
const http = require('http')

const { rootTypeDefs, rootResolvers } = require('./schema')
require('./database')

const app = express()
const httpServer = http.createServer(app)

const server = new ApolloServer({
  typeDefs: rootTypeDefs,
  resolvers: rootResolvers,
  context: ({ event, context, express }) => ({
    headers: event.headers,
    functionName: context.functionName,
    event,
    context,
    expressRequest: express.req
  }),
  plugins: [
    process.env.NODE_ENV === 'production' ? ApolloServerPluginLandingPageDisabled() : ApolloServerPluginLandingPageGraphQLPlayground(),
    ApolloServerPluginDrainHttpServer({ httpServer })
  ]
})

// @ts-ignore
const serverHandler = server.createHandler({ app })

exports.handler = (event, context, callback) => {
  return serverHandler(
    {
      ...event,
      requestContext: event.requestContext || {}
    },
    context,
    callback
  )
}
