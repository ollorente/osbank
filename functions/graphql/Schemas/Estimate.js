// @ts-check
// @ts-ignore
const { gql } = require('apollo-server')

const EstimateModel = require('../Models/Estimate')
const ItemModel = require('../Models/Item')
const MonthModel = require('../Models/Month')
const { EstimateGet, ItemGet, MonthGet } = require('../utils/getData')
const Paginator = require('../utils/paginator')
const Verify = require('../utils/verifyToken')

exports.EstimateSchema = gql`
  extend type Query {
    estimate(id: ID!): Estimate
    estimates(options: Options): [Estimate]
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
    item: Item!
    month: Month!
    year: Int!
    isActive: Boolean
    createdAt: DateTime
    updatedAt: DateTime
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
`

exports.EstimateResolvers = {
  Query: {
    estimate: async (_, { id }, { headers }) => {
      const user = Verify(headers)
      // @ts-ignore
      if (!user?.id) throw new Error('Unauthorized!.')

      let result
      try {
        result = await EstimateModel.findOne({
          _id: id,
          userId: user.id
        })

        return result
      } catch (err) {
        throw new Error(err.message)
      }
    },
    estimates: async (_, { options }, { headers }) => {
      const user = Verify(headers)
      // @ts-ignore
      if (!user?.id) throw new Error('Unauthorized!.')

      const { limit, page } = options
      const P = Paginator(limit, page)

      let result
      try {
        result = await EstimateModel.find({
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
    estimateCreate: async (_, { input }, { headers }) => {
      const user = Verify(headers)
      // @ts-ignore
      if (!user?.id) throw new Error('Unauthorized!.')

      const itemData = await ItemGet(input.item, user.id)
      if (!itemData) throw new Error('Item not exists.')

      const monthData = await MonthGet(input.month)
      if (!monthData) throw new Error('Month not exists.')

      let result
      try {
        const newData = new EstimateModel({
          ...input,
          itemId: itemData._id,
          monthId: monthData._id,
          userId: user.id
        })

        result = await newData.save()

        return result
      } catch (err) {
        throw new Error(err.message)
      }
    },
    estimateUpdate: async (_, { id, input }, { headers }) => {
      const user = Verify(headers)
      // @ts-ignore
      if (!user?.id) throw new Error('Unauthorized!.')

      const estimateData = await EstimateGet(id, user.id)
      if (!estimateData) { throw new Error('Estimate not exists or access denied.') }

      let result
      try {
        if (input.item) {
          const itemData = await ItemGet(input.item, user.id)
          if (!itemData) throw new Error('Item not exists.')

          input.itemId = itemData._id
        }

        if (input.month) {
          const monthData = await MonthGet(input.month)
          if (!monthData) throw new Error('Month not exists.')

          input.monthId = monthData._id
        }

        result = await EstimateModel.findOneAndUpdate(
          {
            _id: estimateData._id
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
    estimateRemove: async (_, { id }, { headers }) => {
      const user = Verify(headers)
      // @ts-ignore
      if (!user?.id) throw new Error('Unauthorized!.')

      const estimateData = await EstimateGet(id, user.id)
      if (!estimateData) return false

      try {
        await EstimateModel.deleteOne({
          _id: estimateData._id
        })

        return true
      } catch (err) {
        throw new Error(err.message)
      }
    }
  },
  Estimate: {
    item: async ({ itemId }, args, ctx) => {
      let result
      try {
        result = await ItemModel.findById(itemId)

        return result
      } catch (err) {
        throw new Error(err.message)
      }
    },
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
