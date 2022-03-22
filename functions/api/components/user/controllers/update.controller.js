// @ts-check
const bcrypt = require('bcryptjs')

const UserModel = require('../model')
const { UserInterface } = require('../dtos')

module.exports = async (req, res, next) => {
  const update = req.body

  const userData = await UserModel.findById(req.user.id)

  if (!userData) {
    return res.status(400).json({
      error: `User not found!.`
    })
  }

  let result
  try {
    if (update.password) {
      const hash = await bcrypt.hash(update.password, 10)
      update.password = hash
    }

    result = await UserModel.findOneAndUpdate({
      _id: userData._id,
    }, {
      $set: update,
    }, {
      new: true,
    })

    res.status(200).json({
      error: false,
      data: UserInterface(result),
    })
  } catch (err) {
    res.status(500).json({
      error: true,
      message: err.message,
    })
  }
}