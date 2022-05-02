// @ts-check
// @ts-ignore
const { gql } = require('apollo-server')

const ExpenseModel = require('../Models/Expense')
const ItemModel = require('../Models/Item')
const MonthModel = require('../Models/Month')
const { ExpenseGet, ItemGet, MonthGet } = require('../utils/getData')
const Paginator = require('../utils/paginator')
const Verify = require('../utils/verifyToken')

exports.ExpenseSchema = gql`
  extend type Query {
    expense(id: ID!): Expense
    expenses(options: Options): [Expense]
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
    item: Item!
    month: Month!
    year: Int!
    isActive: Boolean
    createdAt: DateTime
    updatedAt: DateTime
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
`

exports.ExpenseResolvers = {
  Query: {
    expense: async (_, { id }, { headers }) => {
      const user = Verify(headers)
      // @ts-ignore
      if (!user?.id) throw new Error('Unauthorized!.')

      let result
      try {
        result = await ExpenseModel.findOne({
          _id: id,
          userId: user.id
        })

        return result
      } catch (err) {
        throw new Error(err.message)
      }
    },
    expenses: async (_, { options }, { headers }) => {
      const user = Verify(headers)
      // @ts-ignore
      if (!user?.id) throw new Error('Unauthorized!.')

      const { limit, page } = options
      const P = Paginator(limit, page)

      let result
      try {
        result = await ExpenseModel.find({
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
    expenseCreate: async (_, { input }, { headers }) => {
      const user = Verify(headers)
      // @ts-ignore
      if (!user?.id) throw new Error('Unauthorized!.')

      const itemData = await ItemGet(input.item, user.id)
      if (!itemData) throw new Error('Item not exists.')

      const monthData = await MonthGet(input.month)
      if (!monthData) throw new Error('Month not exists.')

      let result
      try {
        const newData = new ExpenseModel({
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
    expenseUpdate: async (_, { id, input }, { headers }) => {
      const user = Verify(headers)
      // @ts-ignore
      if (!user?.id) throw new Error('Unauthorized!.')

      const expenseData = await ExpenseGet(id, user.id)
      if (!expenseData) throw new Error('Expense not exists or access denied.')

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

        result = await ExpenseModel.findOneAndUpdate(
          {
            _id: expenseData._id
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
    expenseRemove: async (_, { id }, { headers }) => {
      const user = Verify(headers)
      // @ts-ignore
      if (!user?.id) throw new Error('Unauthorized!.')

      const expenseData = await ExpenseGet(id, user.id)
      if (!expenseData) return false

      try {
        await ExpenseModel.deleteOne({
          _id: expenseData._id
        })

        return true
      } catch (err) {
        throw new Error(err.message)
      }
    }
  },
  Expense: {
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
