// @ts-check
// @ts-ignore
const { gql } = require('apollo-server')

const EntryModel = require('../Models/Entry')
const MonthModel = require('../Models/Month')
const Paginator = require('../utils/paginator')
const Verify = require('../utils/verifyToken')

const EntrySchema = gql`
  extend type Query {
    entry(id: ID!): Entry
    entries(options: Options): [Entry]
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
    createdAt: DateTime
    updatedAt: DateTime
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
`

const EntryResolvers = {
  Query: {
    entry: async (_, { id }, { headers }) => {
      const user = Verify(headers)
      // @ts-ignore
      if (!user?.id) throw new Error('Unauthorized!.')

      let result
      try {
        result = await EntryModel.findOne({
          _id: id,
          userId: user.id
        })

        return result
      } catch (err) {
        throw new Error(err.message)
      }
    },
    entries: async (_, { options }, { headers }) => {
      const user = Verify(headers)
      // @ts-ignore
      if (!user?.id) throw new Error('Unauthorized!.')

      const { limit, page } = options
      const P = Paginator(limit, page)

      let result
      try {
        result = await EntryModel.find({
          userId: user.id,
          isActive: true,
          isLock: false
        })
          .limit(P.limit)
          .skip(P.page)
          .sort({
            createdAt: -1
          })

        return result
      } catch (err) {
        throw new Error(err.message)
      }
    }
  },
  Mutation: {
    entryCreate: async (_, { input }, { headers }) => {
      const user = Verify(headers)
      // @ts-ignore
      if (!user?.id) throw new Error('Unauthorized!.')

      const monthData = await MonthModel.findOne({ order: input.month })
      if (!monthData) throw new Error('Month not exists.')

      let result
      try {
        const newData = new EntryModel({
          ...input,
          monthId: monthData._id,
          userId: user.id
        })

        result = await newData.save()

        return result
      } catch (err) {
        throw new Error(err.message)
      }
    },
    entryUpdate: async (_, { id, input }, { headers }) => {
      const user = Verify(headers)
      // @ts-ignore
      if (!user?.id) throw new Error('Unauthorized!.')

      const entryData = await EntryModel.findOne({
        _id: id,
        userId: user.id
      })
      if (!entryData) throw new Error('Entry not exists or access denied.')

      let result
      try {
        result = await EntryModel.findOneAndUpdate(
          {
            _id: entryData._id
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
    entryRemove: async (_, { id }, { headers }) => {
      const user = Verify(headers)
      // @ts-ignore
      if (!user?.id) throw new Error('Unauthorized!.')

      const entryData = await EntryModel.findOne({
        _id: id,
        userId: user.id
      })
      if (!entryData) return false

      try {
        await EntryModel.deleteOne({
          _id: entryData._id
        })

        return true
      } catch (err) {
        throw new Error(err.message)
      }
    }
  },
  Entry: {
    month: async ({ monthId }, args, ctx) => {
      let result
      try {
        result = await MonthModel.findById(monthId)

        return result
      } catch (err) {
        throw new Error(err.message)
      }
    },
    createdAt: async ({ createdAt }, args, ctx) => {
      return { _: new Date(createdAt).toISOString() }
    },
    updatedAt: async ({ updatedAt }, args, ctx) => {
      return { _: new Date(updatedAt).toISOString() }
    }
  }
}

module.exports = { EntrySchema, EntryResolvers }
