// @ts-check
// @ts-ignore
const { gql } = require("apollo-server");

const ItemModel = require("../Models/ItemModel");
const UserModel = require("../Models/UserModel");
const Paginator = require("../utils/paginator");

const ItemSchema = gql`
  extend type Query {
    item(id: ID!): Item
    items(options: ItemOptions): [Item]
  }

  extend type Mutation {
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

  input ItemOptions {
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

const ItemResolvers = {
  Query: {
    item: async (_, { id }, ctx) => {
      const userAuth = await UserModel.findById(ctx.user.id);
      if (!userAuth) throw new Error("Access denied.");

      let result;
      try {
        result = await ItemModel.findOne({
          _id: id,
          userId: userAuth._id,
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

      const userAuth = await UserModel.findById(ctx.user.id);
      if (!userAuth) throw new Error("Access denied.");

      let result;
      try {
        result = await ItemModel.find({
          userId: userAuth._id,
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

      const userAuth = await UserModel.findById(ctx.user.id);
      if (!userAuth) throw new Error("Access denied.");

      let result;
      try {
        const newData = new ItemModel({
          name,
          icon,
          userId: userAuth._id,
        });

        result = await newData.save();

        return result;
      } catch (err) {
        throw new Error(err.message);
      }
    },
    itemUpdate: async (_, { id, input }, ctx) => {
      const userAuth = await UserModel.findById(ctx.user.id);
      if (!userAuth) throw new Error("Access denied.");

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
      const userAuth = await UserModel.findById(ctx.user.id);
      if (!userAuth) throw new Error("Access denied.");

      const itemData = await ItemModel.findById(id);
      if (!itemData) throw new Error("Item not exists.");

      let result;
      try {
        result = await ItemModel.deleteOne({
          _id: itemData._id,
        });

        return result;
      } catch (err) {
        throw new Error(err.message);
      }
    },
  },
};

module.exports = { ItemSchema, ItemResolvers };
