const EntryModel = require('../Models/Entry')
const EstimateModel = require('../Models/Estimate')
const ExpenseModel = require('../Models/Expense')
const ItemModel = require('../Models/Item')
const MonthModel = require('../Models/Month')
const UserModel = require('../Models/User')

exports.EntryGet = async (data, user) => {
  return await EntryModel.findOne({
    _id: data,
    userId: user
  })
}

exports.EstimateGet = async (data, user) => {
  return await EstimateModel.findOne({
    _id: data,
    userId: user
  })
}

exports.ExpenseGet = async (data, user) => {
  return await ExpenseModel.findOne({
    _id: data,
    userId: user
  })
}

exports.ItemGet = async (data, user) => {
  return await ItemModel.findOne({
    _id: data,
    userId: user
  })
}

exports.MonthGet = async (data) => {
  return await MonthModel.findOne({
    order: data
  })
}

exports.UserGet = async (data) => {
  return await UserModel.findOne({
    _id: data
  })
}
