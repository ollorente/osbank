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

const MonthModel = require("./MonthModel");
const Paginator = require("./Paginator");
const VerifyToken = require("./VerifyToken");

const typeDefs = gql`
  type Query {
    month(id: ID!): Month
    months(options: MonthOptionsInput): [Month]
  }

  type Mutation {
    monthCreate(input: MonthCreateInput!): Month
    monthUpdate(id: ID!, input: MonthUpdateInput!): Month
    monthRemove(id: ID!): Boolean
  }

  type Month {
    id: ID!
    name: String!
    order: Int!
    start: Int!
    end: Int!
    isActive: Boolean
    createdAt: String
    updatedAt: String
  }

  input MonthOptionsInput {
    limit: Int
    page: Int
  }

  input MonthCreateInput {
    name: String!
    order: Int!
    start: Int!
    end: Int!
    isActive: Boolean
  }

  input MonthUpdateInput {
    name: String
    order: Int
    start: Int
    end: Int
    isActive: Boolean
  }
`;

mongoose
  .connect(process.env.MONGODB, {})
  .then(() => console.log(`>>> [DB] is connected... <<<`))
  .catch((error) => console.log(`<<< [ERROR]: ${error} >>>`));

const resolvers = {
  Query: {
    month: async (_, { id }, ctx) => {
      let result;
      try {
        result = await MonthModel.findOne({ order: id });

        return result;
      } catch (err) {
        throw new Error(err.message);
      }
    },
    months: async (_, { options }, ctx) => {
      const { limit, page } = options;
      const P = Paginator(limit, page);

      let result;
      try {
        result = await MonthModel.find({
          isActive: true,
        })
          .limit(P.limit)
          .skip(P.page)
          .sort({
            order: 1,
          });

        return result;
      } catch (err) {
        throw new Error(err.message);
      }
    },
  },
  Mutation: {
    monthCreate: async (_, { input }, ctx) => {
      const { name, order, start, end } = input;

      const monthData = await MonthModel.findOne({ name: name });
      if (monthData) throw new Error("Month exists.");

      let result;
      try {
        const newData = new MonthModel({
          name,
          order,
          start,
          end,
        });

        result = await newData.save();

        return result;
      } catch (err) {
        throw new Error(err.message);
      }
    },
    monthUpdate: async (_, { id, input }, ctx) => {
      const monthData = await MonthModel.findOne({ order: id });
      if (!monthData) throw new Error("Month not exists.");

      let result;
      try {
        result = await MonthModel.findOneAndUpdate(
          {
            _id: monthData._id,
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
    monthRemove: async (_, { id }, ctx) => {
      const monthData = await MonthModel.findOne({ order: id });
      if (!monthData) return false;

      try {
        await MonthModel.deleteOne({
          _id: monthData._id,
        });

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
