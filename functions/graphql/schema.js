// @ts-check
const { gql } = require("apollo-server-lambda");
const { EntrySchema, EntryResolvers } = require("./Schemas/Entry");
const { EstimateSchema, EstimateResolvers } = require("./Schemas/Estimate");
const { ExpenseSchema, ExpenseResolvers } = require("./Schemas/Expense");
const { ItemSchema, ItemResolvers } = require("./Schemas/Item");
const { MonthSchema, MonthResolvers } = require("./Schemas/Month");
const { UserSchema, UserResolvers } = require("./Schemas/User");

const rootTypeDefs = gql`
  type Query {
    _: String
  }

  type Mutation {
    _: String
  }
`;

exports.typeDefs = [
  rootTypeDefs,
  EntrySchema,
  EstimateSchema,
  ExpenseSchema,
  ItemSchema,
  MonthSchema,
  UserSchema,
];

exports.resolvers = [
  EntryResolvers,
  EstimateResolvers,
  ExpenseResolvers,
  ItemResolvers,
  MonthResolvers,
  UserResolvers,
];
