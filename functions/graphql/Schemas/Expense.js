// @ts-check
const { gql } = require("apollo-server");

const ExpenseModel = require("../Models/ExpenseModel");
const ItemModel = require("../Models/ItemModel");
const MonthModel = require("../Models/MonthModel");
const UserModel = require("../Models/UserModel");
const Paginator = require("../utils/paginator");

const ExpenseSchema = gql`
  extend type Query {
    expense(id: ID!): Expense
    expenses(options: ExpenseOptions): [Expense]
  }

  extend type Mutation {
    expenseCreate(input: ExpenseCreateInput!): Expense
    expenseUpdate(id: ID!, input: ExpenseUpdateInput!): Expense
    expenseRemove(id: ID!): Boolean
  }

  type Expense {
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

  input ExpenseOptions {
    limit: Int
    page: Int
  }

  input ExpenseCreateInput {
    name: String!
    amount: Int!
    item: String!
    month: String!
    year: Int!
    isActive: Boolean
  }

  input ExpenseUpdateInput {
    name: String
    amount: Int
    item: String
    month: String
    year: Int
    isActive: Boolean
  }
`;

const ExpenseResolvers = {
  Query: {
    expense: async (_, { id }, ctx) => {
      const userAuth = await UserModel.findById(ctx.user.id);
      if (!userAuth) throw new Error("Access denied.");

      let result;
      try {
        result = await ExpenseModel.findOne({
          _id: id,
          userId: userAuth._id,
        });

        return result;
      } catch (err) {
        throw new Error(err.message);
      }
    },
    expenses: async (_, { options }, ctx) => {
      const { limit, page } = options;
      const P = Paginator(limit, page);

      const userAuth = await UserModel.findById(ctx.user.id);
      if (!userAuth) throw new Error("Access denied.");

      let result;
      try {
        result = await ExpenseModel.find({
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
    expenseCreate: async (_, { input }, ctx) => {
      const { amount, name, item, month, year } = input;

      const userAuth = await UserModel.findById(ctx.user.id);
      if (!userAuth) throw new Error("Access denied.");

      const itemData = await ItemModel.findById(item);
      if (!itemData) throw new Error("Item not exists.");

      const monthData = await MonthModel.findOne({ order: month });
      if (!monthData) throw new Error("Month not exists.");

      let result;
      try {
        const newData = new ExpenseModel({
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
    expenseUpdate: async (_, { id, input }, ctx) => {
      const userAuth = await UserModel.findById(ctx.user.id);
      if (!userAuth) throw new Error("Access denied.");

      const expenseData = await ExpenseModel.findOne({
        _id: id,
        userId: userAuth._id,
      });
      if (!expenseData) throw new Error("Expense not exists or access denied.");

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
      const userAuth = await ExpenseModel.findById(ctx.user.id);
      if (!userAuth) throw new Error("Access denied.");

      const expenseData = await ExpenseModel.findOne({
        _id: id,
        userId: userAuth._id,
      });
      if (!expenseData) throw new Error("Expense not exists or access denied.");

      let result;
      try {
        result = await ExpenseModel.deleteOne({
          _id: expenseData._id,
        });

        await UserModel.findOneAndUpdate(
          {
            _id: userAuth._id,
          },
          {
            $inc: {
              expense: -expenseData.amount,
            },
          }
        );

        return result;
      } catch (err) {
        throw new Error(err.message);
      }
    },
  },
  Expense: {
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

module.exports = { ExpenseSchema, ExpenseResolvers };
