// @ts-check
const { ExpenseInterface } = require('../dtos')
const ExpenseModel = require('../model')
const { UserModel } = require('../../user')

module.exports = async (req, res, next) => {
  const { id } = req.params

  const userAuth = await UserModel.findById(req.user.id)
  if (!userAuth) {
    return res.status(400).json({
      error: 'Access denied.'
    })
  }

  let result
  try {
    result = await ExpenseModel.findOne({
      _id: id
    }).populate([
      {
        path: 'itemId',
        match: {
          isActive: true
        }
      },
      {
        path: 'monthId'
      },
      {
        path: 'userId',
        match: {
          isActive: true,
          isLock: false
        }
      }
    ])

    res.status(200).json({
      error: false,
      data: result ? ExpenseInterface(result) : null
    })
  } catch (err) {
    res.status(500).json({
      error: true,
      message: err.message
    })
  }
}
