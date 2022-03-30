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
const bcrypt = require("bcryptjs");
// @ts-ignore
const JWT = require("jsonwebtoken");
// @ts-ignore
const mongoose = require("mongoose");

const UserModel = require("./UserModel");
const Paginator = require("./Paginator");
const Validation = require("./Validation");
const VerifyToken = require("./VerifyToken");

const typeDefs = gql`
  type Query {
    user(id: ID!): User
    users(options: UserOptionsInput): [User]
  }

  type Mutation {
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

  type UserData {
    token: String!
    user: User
  }

  input UserOptionsInput {
    limit: Int
    page: Int
  }

  input UserDataInput {
    username: String!
    password: String!
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

mongoose
  .connect(process.env.MONGODB, {})
  .then(() => console.log(`>>> [DB] is connected... <<<`))
  .catch((error) => console.log(`<<< [ERROR]: ${error} >>>`));

const resolvers = {
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
    users: async (_, { options }, { user }) => {
      console.log(user);
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
        const token = await JWT.sign(
          { id: userData._id },
          process.env.SECRET_KEY,
          {
            expiresIn: "7d",
          }
        );

        result = {
          user: {
            id: await userData._id,
            name: await userData.name,
            isActive: await userData.isActive,
            createdAt: await userData.createdAt,
          },
          token: token,
        };

        return await result;
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
      if (!userData) return false;

      try {
        await UserModel.deleteOne({
          _id: userData._id,
        });

        return true;
      } catch (err) {
        throw new Error(err.message);
      }
    },
  },
  User: {},
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
