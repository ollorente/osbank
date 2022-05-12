// @ts-check
const MonthModel = require('../model')
const { MonthInterface } = require('../dtos')
const { UserModel } = require('../../user')

module.exports = async (req, res, next) => {
  const { id } = req.params
  const update = {
    name: req.body.name,
    order: req.body.order,
    start: req.body.start,
    end: req.body.end,
    isActive: req.body.isActive
  }

  const userAuth = await UserModel.findById(req.user.id)
  if (!userAuth) {
    return res.status(400).json({
      error: 'Access denied.'
    })
  }

  const monthData = await MonthModel.findOne({ order: id })
  if (!monthData) {
    return res.status(400).json({
      error: 'Month not exists.'
    })
  }

  let result
  try {
    result = await MonthModel.findOneAndUpdate(
      {
        _id: monthData._id
      },
      {
        $set: update
      },
      {
        new: true
      }
    )

    res.status(200).json({
      error: false,
      data: MonthInterface(result)
    })
  } catch (err) {
    res.status(500).json({
      error: true,
      message: err.message
    })
  }
}
