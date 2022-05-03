// @ts-check
// @ts-ignore
const { gql } = require('apollo-server')

const ItemModel = require('../Models/Item')
const { ItemGet } = require('../utils/getData')
const Paginator = require('../utils/paginator')
const Verify = require('../utils/verifyToken')

exports.ItemSchema = gql`
  extend type Query {
    item(id: ID!): Item
    items(options: Options): [Item]
    itemsByName(id: String!, options: Options): [Item]
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
    createdAt: DateTime
    updatedAt: DateTime
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
`

exports.ItemResolvers = {
  Query: {
    item: async (_, { id }, { headers }) => {
      const user = Verify(headers)
      // @ts-ignore
      if (!user?.id) throw new Error('Unauthorized!.')

      let result
      try {
        result = await ItemModel.findOne({
          _id: id,
          userId: user.id,
          isActive: true
        })

        return result
      } catch (err) {
        throw new Error(err.message)
      }
    },
    items: async (_, { options }, { headers }) => {
      const user = Verify(headers)
      // @ts-ignore
      if (!user?.id) throw new Error('Unauthorized!.')

      const P = Paginator(options.limit, options.page)

      let result
      try {
        result = await ItemModel.find({
          userId: user.id,
          isActive: true
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
    itemsByName: async (_, { id, options }, { headers }) => {
      const user = Verify(headers)
      // @ts-ignore
      if (!user?.id) throw new Error('Unauthorized!.')

      const P = Paginator(options.limit, options.page)

      let result
      try {
        result = await ItemModel.find({
          userId: user.id,
          isActive: true
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
    itemCreate: async (_, { input }, { headers }) => {
      const user = Verify(headers)
      // @ts-ignore
      if (!user?.id) throw new Error('Unauthorized!.')

      let result
      try {
        const newData = new ItemModel({
          ...input,
          userId: user.id
        })

        result = await newData.save()

        return result
      } catch (err) {
        throw new Error(err.message)
      }
    },
    itemUpdate: async (_, { id, input }, { headers }) => {
      const user = Verify(headers)
      // @ts-ignore
      if (!user?.id) throw new Error('Unauthorized!.')

      const itemData = await ItemGet(id, user.id)
      if (!itemData) throw new Error('Item not exists.')

      let result
      try {
        result = await ItemModel.findOneAndUpdate(
          {
            _id: itemData._id
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
    itemRemove: async (_, { id }, { headers }) => {
      const user = Verify(headers)
      // @ts-ignore
      if (!user?.id) throw new Error('Unauthorized!.')

      const itemData = await ItemGet(id, user.id)
      if (!itemData) return false

      try {
        await ItemModel.deleteOne({
          _id: itemData._id
        })

        return true
      } catch (err) {
        throw new Error(err.message)
      }
    }
  },
  Item: {
    createdAt: async ({ createdAt }, args, ctx) => {
      return { _: new Date(createdAt).toISOString() }
    },
    updatedAt: async ({ updatedAt }, args, ctx) => {
      return { _: new Date(updatedAt).toISOString() }
    }
  }
}
