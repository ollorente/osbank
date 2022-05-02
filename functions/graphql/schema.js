// @ts-check
// @ts-ignore
const { gql } = require('apollo-server-lambda')

const { EntrySchema, EntryResolvers } = require('./Schemas/Entry')
const { EstimateSchema, EstimateResolvers } = require('./Schemas/Estimate')
const { ExpenseSchema, ExpenseResolvers } = require('./Schemas/Expense')
const { ItemSchema, ItemResolvers } = require('./Schemas/Item')
const { MonthSchema, MonthResolvers } = require('./Schemas/Month')
const { UserSchema, UserResolvers } = require('./Schemas/User')

const typeDefinitionss = gql`
  type Query {
    _: String
  }

  type Mutation {
    _: String
  }

  type DateTime {
    _: String
  }

  input Options {
    limit: Int
    page: Int
  }
`

exports.rootTypeDefs = [
  typeDefinitionss,
  EntrySchema,
  EstimateSchema,
  ExpenseSchema,
  ItemSchema,
  MonthSchema,
  UserSchema
]

exports.rootResolvers = [
  EntryResolvers,
  EstimateResolvers,
  ExpenseResolvers,
  ItemResolvers,
  MonthResolvers,
  UserResolvers
]
