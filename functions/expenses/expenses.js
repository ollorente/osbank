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

const ExpenseModel = require("./ExpenseModel");
const Paginator = require("./Paginator");
const VerifyToken = require("./VerifyToken");

const typeDefs = gql`
  type Query {
    expense(id: ID!): Expense
    expenses(options: ExpenseOptionsInput): [Expense]
  }

  type Mutation {
    expenseCreate(input: ExpenseCreateInput!): Expense
    expenseUpdate(id: ID!, input: ExpenseUpdateInput!): Expense
    expenseRemove(id: ID!): Boolean
  }

  type Expense {
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

  input ExpenseOptionsInput {
    limit: Int
    page: Int
  }

  input ExpenseCreateInput {
    name: String!
    amount: Int!
    itemId: String!
    monthId: String!
    year: Int!
    isActive: Boolean
  }

  input ExpenseUpdateInput {
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
    expense: async (_, { id }, ctx) => {
      let result;
      try {
        result = await ExpenseModel.findOne({
          _id: id,
        });

        return result;
      } catch (err) {
        throw new Error(err.message);
      }
    },
    expenses: async (_, { options }, ctx) => {
      const { limit, page } = options;
      const P = Paginator(limit, page);

      let result;
      try {
        result = await ExpenseModel.find({
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
    expenseCreate: async (_, { input }, ctx) => {
      const { amount, name, itemId, monthId, year } = input;

      let result;
      try {
        const newData = new ExpenseModel({
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
    expenseUpdate: async (_, { id, input }, ctx) => {
      const expenseData = await ExpenseModel.findOne({ _id: id });
      if (!expenseData) throw new Error("Expense not exists or access denied.");

      let result;
      try {
        result = await ExpenseModel.findOneAndUpdate(
          {
            _id: expenseData._id,
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
    expenseRemove: async (_, { id }, ctx) => {
      const expenseData = await ExpenseModel.findOne({ _id: id });
      if (!expenseData) return false;

      try {
        await ExpenseModel.deleteOne({
          _id: expenseData._id,
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
