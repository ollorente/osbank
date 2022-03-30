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

const EntryModel = require("./EntryModel");
const Paginator = require("./Paginator");
const VerifyToken = require("./VerifyToken");

const typeDefs = gql`
  type Query {
    entry(id: ID!): Entry
    entries(options: EntryOptionsInput): [Entry]
  }

  type Mutation {
    entryCreate(input: EntryCreateInput!): Entry
    entryUpdate(id: ID!, input: EntryUpdateInput!): Entry
    entryRemove(id: ID!): Boolean
  }

  type Entry {
    id: ID!
    amount: Int!
    detail: String
    monthId: String
    year: Int!
    isActive: Boolean
    createdAt: String
    updatedAt: String
  }

  input EntryOptionsInput {
    limit: Int
    page: Int
  }

  input EntryCreateInput {
    amount: Int!
    detail: String
    monthId: String!
    year: Int!
    isActive: Boolean
  }

  input EntryUpdateInput {
    amount: Int
    detail: String
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
    entry: async (_, { id }, ctx) => {
      let result;
      try {
        result = await EntryModel.findOne({
          _id: id,
        });

        return result;
      } catch (err) {
        throw new Error(err.message);
      }
    },
    entries: async (_, { options }, { user }) => {
      const { limit, page } = options;
      const P = Paginator(limit, page);

      let result;
      try {
        result = await EntryModel.find({
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
    entryCreate: async (_, { input }, ctx) => {
      const { amount, detail, monthId, year } = input;

      let result;
      try {
        const newData = new EntryModel({
          amount,
          detail,
          monthId,
          year,
        });

        result = await newData.save();

        return result;
      } catch (err) {
        throw new Error(err.message);
      }
    },
    entryUpdate: async (_, { id, input }, ctx) => {
      const entryData = await EntryModel.findOne({ _id: id });
      if (!entryData) throw new Error("Entry not exists or access denied.");

      let result;
      try {
        result = await EntryModel.findOneAndUpdate(
          {
            _id: entryData._id,
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
    entryRemove: async (_, { id }, ctx) => {
      const entryData = await EntryModel.findOne({ _id: id });
      if (!entryData) return false;

      try {
        await EntryModel.deleteOne({
          _id: entryData._id,
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
