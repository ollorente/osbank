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

const ItemModel = require("./ItemModel");
const Paginator = require("./Paginator");
const VerifyToken = require("./VerifyToken");

const typeDefs = gql`
  type Query {
    item(id: ID!): Item
    items(options: ItemOptionsInput): [Item]
  }

  type Mutation {
    itemCreate(input: ItemCreateInput!): Item
    itemUpdate(id: ID!, input: ItemUpdateInput!): Item
    itemRemove(id: ID!): Boolean
  }

  type Item {
    id: ID!
    name: String!
    icon: String
    isActive: Boolean
    createdAt: String
    updatedAt: String
  }

  input ItemOptionsInput {
    limit: Int
    page: Int
  }

  input ItemCreateInput {
    name: String!
    icon: String
    isActive: Boolean
  }

  input ItemUpdateInput {
    name: String
    icon: String
    isActive: Boolean
  }
`;

mongoose
  .connect(process.env.MONGODB, {})
  .then(() => console.log(`>>> [DB] is connected... <<<`))
  .catch((error) => console.log(`<<< [ERROR]: ${error} >>>`));

const resolvers = {
  Query: {
    item: async (_, { id }, ctx) => {
      let result;
      try {
        result = await ItemModel.findOne({
          _id: id,
          isActive: true,
        });

        return result;
      } catch (err) {
        throw new Error(err.message);
      }
    },
    items: async (_, args, ctx) => {
      const { limit, page } = args;
      const P = Paginator(limit, page);

      let result;
      try {
        result = await ItemModel.find({
          isActive: true,
        })
          .limit(P.limit)
          .skip(P.page)
          .sort({
            name: 1,
          });

        return result;
      } catch (err) {
        throw new Error(err.message);
      }
    },
  },
  Mutation: {
    itemCreate: async (_, { input }, ctx) => {
      const { name, icon } = input;

      let result;
      try {
        const newData = new ItemModel({
          name,
          icon,
        });

        result = await newData.save();

        return result;
      } catch (err) {
        throw new Error(err.message);
      }
    },
    itemUpdate: async (_, { id, input }, ctx) => {
      const itemData = await ItemModel.findById(id);
      if (!itemData) throw new Error("Item not exists.");

      let result;
      try {
        result = await ItemModel.findOneAndUpdate(
          {
            _id: itemData._id,
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
    itemRemove: async (_, { id }, ctx) => {
      const itemData = await ItemModel.findById(id);
      if (!itemData) return false;

      try {
        await ItemModel.deleteOne({
          _id: itemData._id,
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
