// @ts-check
const { gql } = require("apollo-server");

const EstimateModel = require("../Models/EstimateModel");
const ItemModel = require("../Models/ItemModel");
const MonthModel = require("../Models/MonthModel");
const UserModel = require("../Models/UserModel");
const Paginator = require("../utils/paginator");

const EstimateSchema = gql`
  extend type Query {
    estimate(id: ID!): Estimate
    estimates(options: EstimateOptions): [Estimate]
  }

  extend type Mutation {
    estimateCreate(input: EstimateCreateInput!): Estimate
    estimateUpdate(id: ID!, input: EstimateUpdateInput!): Estimate
    estimateRemove(id: ID!): Boolean
  }

  type Estimate {
    id: ID!
    name: String
    amount: Int!
    item: String
    month: String
    year: Int!
    isActive: Boolean
    createdAt: String
    updatedAt: String
  }

  type EstimateOptions {
    limit: Int
    page: Int
  }

  input EstimateCreateInput {
    name: String!
    amount: Int!
    item: String!
    month: String!
    year: Int!
    isActive: Boolean
  }

  input EstimateUpdateInput {
    name: String
    amount: Int
    item: String
    month: String
    year: Int
    isActive: Boolean
  }
`;

const EstimateResolvers = {
  Query: {
    estimate: async (_, { id }, ctx) => {
      const userAuth = await UserModel.findById(ctx.user.id);
      if (!userAuth) throw new Error("Access denied.");

      let result;
      try {
        result = await EstimateModel.findOne({
          _id: id,
          userId: userAuth._id,
        });

        return result;
      } catch (err) {
        throw new Error(err.message);
      }
    },
    estimates: async (_, { options }, ctx) => {
      const { limit, page } = options;
      const P = Paginator(limit, page);

      const userAuth = await UserModel.findById(ctx.user.id);
      if (!userAuth) throw new Error("Access denied.");

      let result;
      try {
        result = await EstimateModel.find({
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
    estimateCreate: async (_, { input }, ctx) => {
      const { amount, name, item, month, year } = input;

      const userAuth = await UserModel.findById(ctx.user.id);
      if (!userAuth) throw new Error("Access denied.");

      const itemData = await ItemModel.findById(item);
      if (!itemData) throw new Error("Item not exists.");

      const monthData = await MonthModel.findOne({ order: month });
      if (!monthData) throw new Error("Month not exists.");

      let result;
      try {
        const newData = new EstimateModel({
          amount,
          name,
          itemId: itemData._id,
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
    estimateUpdate: async (_, { id, input }, ctx) => {
      const userAuth = await UserModel.findById(ctx.user.id);
      if (!userAuth) throw new Error("Access denied.");

      const estimateData = await EstimateModel.findOne({
        _id: id,
        userId: userAuth._id,
      });
      if (!estimateData)
        throw new Error("Estimate not exists or access denied.");

      let result;
      try {
        if (input.item) {
          const itemData = await ItemModel.findById(input.item);
          if (!itemData) throw new Error("Item not exists.");

          input.itemId = itemData._id;
        }

        if (input.month) {
          const monthData = await MonthModel.findOne({ order: input.month });
          if (!monthData) throw new Error("Month not exists.");

          input.monthId = monthData._id;
        }

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
      const userAuth = await EstimateModel.findById(ctx.user.id);
      if (!userAuth) throw new Error("Access denied.");

      const estimateData = await EstimateModel.findOne({
        _id: id,
        userId: userAuth._id,
      });
      if (!estimateData)
        throw new Error("Estimate not exists or access denied.");

      let result;
      try {
        result = await EstimateModel.deleteOne({
          _id: estimateData._id,
        });

        await UserModel.findOneAndUpdate(
          {
            _id: userAuth._id,
          },
          {
            $inc: {
              estimate: -estimateData.amount,
            },
          }
        );

        return result;
      } catch (err) {
        throw new Error(err.message);
      }
    },
  },
  Estimate: {
    item: async ({ itemId }, args, ctx) => {
      let result;
      try {
        result = await ItemModel.findById(itemId);

        return result;
      } catch (err) {
        throw new Error(err.message);
      }
    },
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

module.exports = { EstimateSchema, EstimateResolvers };
