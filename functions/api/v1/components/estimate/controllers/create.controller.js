// @ts-check
const EstimateModel = require('../model')
const { EstimateRefInterface } = require('../dtos')
const { ItemModel } = require('../../item')
const { MonthModel } = require('../../month')
const { UserModel } = require('../../user')

module.exports = async (req, res, next) => {
  const { name, amount, item, month, year } = req.body

  const userAuth = await UserModel.findById(req.user.id)
  if (!userAuth) {
    return res.status(400).json({
      error: true,
      message: 'Access denied.'
    })
  }

  const itemData = await ItemModel.findById(item)
  if (!itemData) {
    return res.status(400).json({
      error: true,
      message: 'Item not exists!.'
    })
  }

  const monthData = await MonthModel.findById(month)
  if (!monthData) {
    return res.status(400).json({
      error: true,
      message: 'Month not exists!.'
    })
  }

  let result
  try {
    const newData = new EstimateModel({
      name,
      amount,
      itemId: itemData._id,
      monthId: monthData._id,
      year,
      userId: userAuth._id
    })

    result = await newData.save().populate({
      path: 'monthId',
      match: {
        isActive: true
      }
    })

    res.status(201).json({
      error: false,
      data: EstimateRefInterface(result)
    })
  } catch (err) {
    res.status(500).json({
      error: true,
      message: err.message
    })
  }
}
