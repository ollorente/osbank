// @ts-check
// @ts-ignore
const { gql } = require('apollo-server')

const MonthModel = require('../Models/Month')
const Paginator = require('../utils/paginator')
const Verify = require('../utils/verifyToken')

const MonthSchema = gql`
  extend type Query {
    month(id: ID!): Month
    months(options: Options): [Month]
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
    createdAt: DateTime
    updatedAt: DateTime
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
`

const MonthResolvers = {
  Query: {
    month: async (_, { id }, { headers }) => {
      const user = Verify(headers)
      // @ts-ignore
      if (!user?.id) throw new Error('Unauthorized!.')

      let result
      try {
        result = await MonthModel.findOne({ order: id })

        return result
      } catch (err) {
        throw new Error(err.message)
      }
    },
    months: async (_, { options }, { headers }) => {
      const user = Verify(headers)
      // @ts-ignore
      if (!user?.id) throw new Error('Unauthorized!.')

      const { limit, page } = options
      const P = Paginator(limit, page)

      let result
      try {
        result = await MonthModel.find({
          isActive: true
        })
          .limit(P.limit)
          .skip(P.page)
          .sort({
            order: 1
          })

        return result
      } catch (err) {
        throw new Error(err.message)
      }
    }
  },
  Mutation: {
    monthCreate: async (_, { input }, { headers }) => {
      const user = Verify(headers)
      // @ts-ignore
      if (!user?.id) throw new Error('Unauthorized!.')

      const monthData = await MonthModel.findOne({ name: input.name })
      if (monthData) throw new Error('Month exists.')

      let result
      try {
        const newData = new MonthModel({
          ...input
        })

        result = await newData.save()

        return result
      } catch (err) {
        throw new Error(err.message)
      }
    },
    monthUpdate: async (_, { id, input }, { headers }) => {
      const user = Verify(headers)
      // @ts-ignore
      if (!user?.id) throw new Error('Unauthorized!.')

      const monthData = await MonthModel.findOne({ order: id })
      if (!monthData) throw new Error('Month not exists.')

      let result
      try {
        result = await MonthModel.findOneAndUpdate(
          {
            _id: monthData._id
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
    monthRemove: async (_, { id }, { headers }) => {
      const user = Verify(headers)
      // @ts-ignore
      if (!user?.id) throw new Error('Unauthorized!.')

      const monthData = await MonthModel.findOne({ order: id })
      if (!monthData) return false

      try {
        await MonthModel.deleteOne({
          _id: monthData._id
        })

        return true
      } catch (err) {
        throw new Error(err.message)
      }
    }
  },
  Month: {
    createdAt: async ({ createdAt }, args, ctx) => {
      return { _: new Date(createdAt).toISOString() }
    },
    updatedAt: async ({ updatedAt }, args, ctx) => {
      return { _: new Date(updatedAt).toISOString() }
    }
  }
}

module.exports = { MonthSchema, MonthResolvers }
