// @ts-check
const { gql } = require("apollo-server");
const bcrypt = require("bcryptjs");
const JWT = require("jsonwebtoken");

const UserModel = require("../Models/UserModel.js");
const Paginator = require("../utils/paginator");

const UserSchema = gql`
  extend type Query {
    user(id: ID!): User
    users(options: UserOptions): [User]
  }

  extend type Mutation {
    auth(input: UserDataInput!): UserData
    userCreate(input: UserCreateInput!): User
    userUpdate(id: ID!, input: UserUpdateInput!): User
    userRemove(id: ID!): Boolean
  }

  type User {
    id: ID!
    phone: String!
    name: String!
    email: String!
    total: Int
    estimate: Int
    expense: Int
    isActive: Boolean
    isLock: Boolean
    createdAt: String
    updatedAt: String
  }

  type UserOptions {
    limit: Int
    page: Int
  }

  input UserDataInput {
    username: String!
    password: String!
  }

  type UserData {
    token: String!
    user: ID!
  }

  input UserCreateInput {
    phone: String!
    name: String!
    email: String!
    password: String!
    isActive: Boolean
  }

  input UserUpdateInput {
    phone: String
    name: String
    password: String
    total: Int
    estimate: Int
    expense: Int
    isActive: Boolean
    isLock: Boolean
  }
`;

const UserResolvers = {
  Query: {
    user: async (_, { id }, ctx) => {
      let result;
      try {
        result = await UserModel.findById(id);

        return result;
      } catch (err) {
        throw new Error(err.message);
      }
    },
    users: async (_, { options }, ctx) => {
      const { limit, page } = options;
      const P = Paginator(limit, page);

      let result;
      try {
        result = await UserModel.find({
          isActive: true,
          isLock: false,
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
    auth: async (_, { input }, ctx) => {
      const { username, password } = input;

      const userData = await UserModel.findOne({
        $or: [
          {
            email: username,
          },
          {
            phone: username,
          },
        ],
      });
      if (!userData) throw new Error("User or password in wrong!.");

      const isEqual = await bcrypt.compare(password, userData.password);
      if (!isEqual) throw new Error("User or password in wrong!.");

      let result;
      try {
        const token = JWT.sign({ id: userData._id }, process.env.SECRET_KEY, {
          expiresIn: "7d",
        });

        result = { user: userData._id, token: token };

        return result;
      } catch (err) {
        throw new Error(err.message);
      }
    },
    userCreate: async (_, { input }, ctx) => {
      const { name, phone, email, password, isActive } = input;

      const emailExist = await UserModel.findOne({ email: email });
      if (emailExist) throw new Error("Email already exist!.");

      const phoneExist = await UserModel.findOne({ phone: phone });
      if (phoneExist) throw new Error("Phone already exist!.");

      let result;
      try {
        const newData = new UserModel({
          name,
          phone,
          email,
          password,
          isActive,
        });

        result = await newData.save();

        return result;
      } catch (err) {
        throw new Error(err.message);
      }
    },
    userUpdate: async (_, { id, input }, ctx) => {
      const userData = await UserModel.findById(id);
      if (!userData) throw new Error("User not found!.");

      let result;
      try {
        if (input.password) {
          const hash = await bcrypt.hash(input.password, 10);
          input.password = hash;
        }

        result = await UserModel.findOneAndUpdate(
          {
            _id: userData._id,
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
    userRemove: async (_, { id }, ctx) => {
      const userData = await UserModel.findById(id);
      if (!userData) throw new Error("User not found!.");

      try {
        await UserModel.deleteOne({
          _id: userData._id,
        });

        return userData ? true : false;
      } catch (err) {
        throw new Error(err.message);
      }
    },
  },
  User: {},
};

module.exports = { UserSchema, UserResolvers };
