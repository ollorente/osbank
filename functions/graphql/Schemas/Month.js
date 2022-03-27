// @ts-check
const { gql } = require("apollo-server");

const MonthModel = require("../Models/MonthModel");
const UserModel = require("../Models/UserModel");
const Paginator = require("../utils/paginator");

const MonthSchema = gql`
  extend type Query {
    month(id: ID!): Month
    months(options: MonthOptions): [Month]
  }

  extend type Mutation {
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

  input MonthOptions {
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

const MonthResolvers = {
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

      const userAuth = await UserModel.findById(ctx.user.id);
      if (!userAuth) throw new Error("Access denied.");

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
      const userAuth = await UserModel.findById(ctx.user.id);
      if (!userAuth) throw new Error("Access denied.");

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
      const userAuth = await UserModel.findById(ctx.user.id);
      if (!userAuth) throw new Error("Access denied.");

      const monthData = await MonthModel.findOne({ order: id });
      if (!monthData) throw new Error("Month exists.");

      let result;
      try {
        result = await MonthModel.deleteOne({
          _id: monthData._id,
        });

        return result;
      } catch (err) {
        throw new Error(err.message);
      }
    },
  },
};

module.exports = { MonthSchema, MonthResolvers };
