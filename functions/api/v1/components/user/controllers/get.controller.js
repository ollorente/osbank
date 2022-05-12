// @ts-check
const { UserInterface } = require('../dtos')
const UserModel = require('../model')

module.exports = async (req, res, next) => {
  let result
  try {
    result = await UserModel.findById(req.user.id)

    res.status(200).json({
      error: false,
      data: result ? UserInterface(result) : null
    })
  } catch (err) {
    res.status(500).json({
      error: true,
      message: err.message
    })
  }
}
