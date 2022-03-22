// @ts-check
const UserModel = require('../model')

module.exports = async (req, res, next) => {
  const userData = await UserModel.findById(req.user.id)

  if (!userData) {
    return res.status(400).json({
      error: `User not found!.`
    })
  }

  let result
  try {
    result = await UserModel.deleteOne({
      _id: userData._id,
    })

    res.status(200).json({
      error: false,
      data: result,
    })
  } catch (err) {
    res.status(500).json({
      error: true,
      message: err.message,
    })
  }
}