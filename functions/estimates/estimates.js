// @ts-check
const express = require("express");
// @ts-ignore
const { ApolloServer, gql } = require("apollo-server-lambda");
const {
  ApolloServerPluginLandingPageDisabled,
  ApolloServerPluginLandingPageGraphQLPlayground,
  // @ts-ignore
} = require("apollo-server-core");
// @ts-ignore
const mongoose = require("mongoose");

const EstimateModel = require("./EstimateModel");
const Paginator = require("./Paginator");
const VerifyToken = require("./VerifyToken");

const typeDefs = gql`
  type Query {
    estimate(id: ID!): Estimate
    estimates(options: EstimateOptionsInput): [Estimate]
  }

  type Mutation {
    estimateCreate(input: EstimateCreateInput!): Estimate
    estimateUpdate(id: ID!, input: EstimateUpdateInput!): Estimate
    estimateRemove(id: ID!): Boolean
  }

  type Estimate {
    id: ID!
    name: String
    amount: Int!
    itemId: String
    monthId: String
    year: Int!
    isActive: Boolean
    createdAt: String
    updatedAt: String
  }

  input EstimateOptionsInput {
    limit: Int
    page: Int
  }

  input EstimateCreateInput {
    name: String!
    amount: Int!
    itemId: String!
    monthId: String!
    year: Int!
    isActive: Boolean
  }

  input EstimateUpdateInput {
    name: String
    amount: Int
    itemId: String
    monthId: String
    year: Int
    isActive: Boolean
  }
`;

mongoose
  .connect(process.env.MONGODB, {})
  .then(() => console.log(`>>> [DB] is connected... <<<`))
  .catch((error) => console.log(`<<< [ERROR]: ${error} >>>`));

const resolvers = {
  Query: {
    estimate: async (_, { id }, ctx) => {
      let result;
      try {
        result = await EstimateModel.findOne({
          _id: id,
        });

        return result;
      } catch (err) {
        throw new Error(err.message);
      }
    },
    estimates: async (_, { options }, ctx) => {
      const { limit, page } = options;
      const P = Paginator(limit, page);

      let result;
      try {
        result = await EstimateModel.find({
          isActive: true,
          isLock: false,
        })
          .limit(P.limit)
          .skip(P.page)
          .sort({
            createdAt: -1,
          });

        return result;
      } catch (err) {
        throw new Error(err.message);
      }
    },
  },
  Mutation: {
    estimateCreate: async (_, { input }, ctx) => {
      const { amount, name, itemId, monthId, year } = input;

      let result;
      try {
        const newData = new EstimateModel({
          amount,
          name,
          itemId,
          monthId,
          year,
        });

        result = await newData.save();

        return result;
      } catch (err) {
        throw new Error(err.message);
      }
    },
    estimateUpdate: async (_, { id, input }, ctx) => {
      const estimateData = await EstimateModel.findOne({ _id: id });
      if (!estimateData)
        throw new Error("Estimate not exists or access denied.");

      let result;
      try {
        result = await EstimateModel.findOneAndUpdate(
          {
            _id: estimateData._id,
          },
          {
            $set: input,
          },
          {
            new: true,
          }
        );

        return result;
      } catch (err) {
        throw new Error(err.message);
      }
    },
    estimateRemove: async (_, { id }, ctx) => {
      const estimateData = await EstimateModel.findOne({ _id: id });
      if (!estimateData) return false;

      try {
        await EstimateModel.deleteOne({ _id: estimateData._id });

        return true;
      } catch (err) {
        throw new Error(err.message);
      }
    },
  },
};

const app = express();
app.use(VerifyToken);

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: {},
  plugins: [
    process.env.NODE_ENV === "production"
      ? ApolloServerPluginLandingPageDisabled()
      : ApolloServerPluginLandingPageGraphQLPlayground(),
  ],
});

// @ts-ignore
const serverHandler = server.createHandler({ app });

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
