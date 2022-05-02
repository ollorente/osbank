// @ts-check
const { EntryInterface } = require('../dtos')
const EntryModel = require('../model')
const { UserModel } = require('../../user')

module.exports = async (req, res, next) => {
  const { id } = req.paramsM

  const userAuth = await UserModel.findById(req.user.id)
  if (!userAuth) {
    return res.status(400).json({
      error: 'Access denied.'
    })
  }

  let result
  try {
    result = await EntryModel.findOne({
      _id: id,
      userId: userAuth._id
    })

    res.status(200).json({
      error: false,
      data: result ? EntryInterface(result) : null
    })
  } catch (err) {
    res.status(500).json({
      error: true,
      message: err.message
    })
  }
}
