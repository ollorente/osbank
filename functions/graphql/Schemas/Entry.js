// @ts-check
const { gql } = require("apollo-server");

const EntryModel = require("../Models/EntryModel");
const MonthModel = require("../Models/MonthModel");
const UserModel = require("../Models/UserModel");
const Paginator = require("../utils/paginator");

const EntrySchema = gql`
  extend type Query {
    entry(id: ID!): Entry
    entries(options: EntryOptions): [Entry]
  }

  extend type Mutation {
    entryCreate(input: EntryCreateInput!): Entry
    entryUpdate(id: ID!, input: EntryUpdateInput!): Entry
    entryRemove(id: ID!): Boolean
  }

  type Entry {
    id: ID!
    amount: Int!
    detail: String
    month: String
    year: Int!
    isActive: Boolean
    createdAt: String
    updatedAt: String
  }

  type EntryOptions {
    limit: Int
    page: Int
  }

  input EntryCreateInput {
    amount: Int!
    detail: String
    month: String!
    year: Int!
    isActive: Boolean
  }

  input EntryUpdateInput {
    amount: Int
    detail: String
    month: String
    year: Int
    isActive: Boolean
  }
`;

const EntryResolvers = {
  Query: {
    entry: async (_, { id }, ctx) => {
      const userAuth = await UserModel.findById(ctx.user.id);
      if (!userAuth) throw new Error("Access denied.");

      let result;
      try {
        result = await EntryModel.findOne({
          _id: id,
          userId: userAuth._id,
        });

        return result;
      } catch (err) {
        throw new Error(err.message);
      }
    },
    entries: async (_, { options }, ctx) => {
      const { limit, page } = options;
      const P = Paginator(limit, page);

      const userAuth = await UserModel.findById(ctx.user.id);
      if (!userAuth) throw new Error("Access denied.");

      let result;
      try {
        result = await EntryModel.find({
          userId: userAuth._id,
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
      const { amount, detail, month, year } = input;

      const userAuth = await UserModel.findById(ctx.user.id);
      if (!userAuth) throw new Error("Access denied.");

      const monthData = await MonthModel.findOne({ order: month });
      if (!monthData) throw new Error("Month not exists.");

      let result;
      try {
        const newData = new EntryModel({
          amount,
          detail,
          monthId: monthData._id,
          year,
          userId: userAuth._id,
        });

        result = await newData.save();

        return result;
      } catch (err) {
        throw new Error(err.message);
      }
    },
    entryUpdate: async (_, { id, input }, ctx) => {
      const userAuth = await UserModel.findById(ctx.user.id);
      if (!userAuth) throw new Error("Access denied.");

      const entryData = await EntryModel.findOne({
        _id: id,
        userId: userAuth._id,
      });
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
      const userAuth = await EntryModel.findById(ctx.user.id);
      if (!userAuth) throw new Error("Access denied.");

      const entryData = await EntryModel.findOne({
        _id: id,
        userId: userAuth._id,
      });
      if (!entryData) throw new Error("Entry not exists or access denied.");

      let result;
      try {
        result = await EntryModel.deleteOne({
          _id: entryData._id,
        });

        await UserModel.findOneAndUpdate(
          {
            _id: userAuth._id,
          },
          {
            $inc: {
              total: -entryData.amount,
            },
          }
        );

        return result;
      } catch (err) {
        throw new Error(err.message);
      }
    },
  },
  Entry: {
    month: async ({ monthId }, args, ctx) => {
      let result;
      try {
        result = await MonthModel.findById(monthId);

        return result;
      } catch (err) {
        throw new Error(err.message);
      }
    },
  },
};

module.exports = { EntrySchema, EntryResolvers };
