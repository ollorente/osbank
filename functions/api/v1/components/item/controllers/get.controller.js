// @ts-check
const { ItemInterface } = require('../dtos')
const ItemModel = require('../model')
const { UserModel } = require('../../user')

module.exports = async (req, res, next) => {
  const { id } = req.params

  const userAuth = await UserModel.findById(req.user.id)
  if (!userAuth) {
    return res.status(400).json({
      error: true,
      message: 'Access denied.'
    })
  }

  let result
  try {
    result = await ItemModel.findOne({ _id: id, userId: userAuth.id })

    res.status(200).json({
      error: false,
      data: result ? ItemInterface(result) : null
    })
  } catch (err) {
    res.status(500).json({
      error: true,
      message: err.message
    })
  }
}
