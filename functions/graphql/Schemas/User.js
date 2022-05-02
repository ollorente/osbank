// @ts-check
// @ts-ignore
const { gql } = require('apollo-server')
// @ts-ignore
const bcrypt = require('bcryptjs')
// @ts-ignore
const JWT = require('jsonwebtoken')

const UserModel = require('../Models/User')
const Paginator = require('../utils/paginator')
const Verify = require('../utils/verifyToken')

exports.UserSchema = gql`
  extend type Query {
    me: User
    user(id: ID!): User
    users(options: Options): [User]
    usersByName(id: String!, options: Options): [User]
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
    createdAt: DateTime
    updatedAt: DateTime
  }

  type UserData {
    token: String!
    user: User
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
    isActive: Boolean
    isLock: Boolean
  }
`

exports.UserResolvers = {
  Query: {
    me: async (_, args, { headers }) => {
      const user = Verify(headers)
      // @ts-ignore
      if (!user?.id) throw new Error('Unauthorized!.')

      const id = null
      let result
      try {
        result = await UserModel.findById(id)

        return result
      } catch (err) {
        throw new Error(err.message)
      }
    },
    user: async (_, { id }, { headers }) => {
      const user = Verify(headers)
      // @ts-ignore
      if (!user?.id) throw new Error('Unauthorized!.')

      let result
      try {
        result = await UserModel.findById(id)

        return result
      } catch (err) {
        throw new Error(err.message)
      }
    },
    users: async (_, { options }, { headers }) => {
      const user = Verify(headers)
      // @ts-ignore
      if (!user?.id) throw new Error('Unauthorized!.')

      const { limit, page } = options
      const P = Paginator(limit, page)

      let result
      try {
        result = await UserModel.find({
          isActive: true,
          isLock: false
        })
          .limit(P.limit)
          .skip(P.page)
          .sort({
            name: 1
          })

        return result
      } catch (err) {
        throw new Error(err.message)
      }
    },
    usersByName: async (_, { id, options }, { headers }) => {
      const user = Verify(headers)
      // @ts-ignore
      if (!user?.id) throw new Error('Unauthorized!.')

      const { limit, page } = options
      const P = Paginator(limit, page)

      let result
      try {
        result = await UserModel.find({
          isActive: true,
          isLock: false
        })
          .limit(P.limit)
          .skip(P.page)
          .sort({
            name: 1
          })

        return result
      } catch (err) {
        throw new Error(err.message)
      }
    }
  },
  Mutation: {
    auth: async (_, { input }, ctx) => {
      const { username, password } = input

      const userData = await UserModel.findOne({
        $or: [
          {
            email: username
          },
          {
            phone: username
          }
        ]
      })
      if (!userData) throw new Error('User or password in wrong!.')

      const isEqual = await bcrypt.compare(password, userData.password)
      if (!isEqual) throw new Error('User or password in wrong!.')

      let result
      try {
        const token = await JWT.sign(
          { id: userData._id },
          process.env.SECRET_KEY,
          {
            expiresIn: '7d'
          }
        )

        result = {
          user: {
            id: await userData._id,
            name: await userData.name,
            isActive: await userData.isActive,
            createdAt: await userData.createdAt
          },
          token
        }

        return await result
      } catch (err) {
        throw new Error(err.message)
      }
    },
    userCreate: async (_, { input }, ctx) => {
      const emailExist = await UserModel.findOne({ email: input.email })
      if (emailExist) throw new Error('Email already exist!.')

      const phoneExist = await UserModel.findOne({ phone: input.phone })
      if (phoneExist) throw new Error('Phone already exist!.')

      let result
      try {
        const newData = new UserModel({
          ...input
        })

        result = await newData.save()

        return result
      } catch (err) {
        throw new Error(err.message)
      }
    },
    userUpdate: async (_, { id, input }, { headers }) => {
      const user = Verify(headers)
      // @ts-ignore
      if (!user?.id) throw new Error('Unauthorized!.')

      const userData = await UserModel.findById(id)
      if (!userData) throw new Error('User not found!.')

      let result
      try {
        if (input.password) {
          const hash = await bcrypt.hash(input.password, 10)
          input.password = hash
        }

        result = await UserModel.findOneAndUpdate(
          {
            _id: userData._id
          },
          {
            $set: input
          },
          {
            new: true
          }
        )

        return result
      } catch (err) {
        throw new Error(err.message)
      }
    },
    userRemove: async (_, { id }, { headers }) => {
      const user = Verify(headers)
      // @ts-ignore
      if (!user?.id) throw new Error('Unauthorized!.')

      const userData = await UserModel.findById(id)
      if (!userData) return false

      try {
        await UserModel.deleteOne({
          _id: userData._id
        })

        return true
      } catch (err) {
        throw new Error(err.message)
      }
    }
  },
  User: {
    total: async ({ id }, args, ctx) => {},
    estimate: async ({ id }, args, ctx) => {},
    expense: async ({ id }, args, ctx) => {},
    createdAt: async ({ createdAt }, args, ctx) => {
      return { _: new Date(createdAt).toISOString() }
    },
    updatedAt: async ({ updatedAt }, args, ctx) => {
      return { _: new Date(updatedAt).toISOString() }
    }
  }
}
