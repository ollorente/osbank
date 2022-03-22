const bcrypt = require('bcryptjs')
const JWT = require('jsonwebtoken')

const UserModel = require('../model')
const { UserRefInterface } = require('../dtos')
const { loginValidation } = require('../../../utils/validation')

module.exports = async (req, res, next) => {
  try {
    const { error } = loginValidation(req.body)

    if (error) {
      return res.status(400).json({
        error: true,
        message: error.details[0].message,
      })
    }

    const userData = await UserModel.findOne({
      $or: [{ email: req.body.email }, { phone: req.body.email }],
    })

    if (!userData) {
      return res.status(400).json({
        error: true,
        message: 'Email or password in wrong!',
      })
    }

    const isValidPass = await bcrypt.compare(
      req.body.password,
      userData.password
    )

    if (!isValidPass) {
      return res.status(400).json({
        error: true,
        message: 'Email or password in wrong!',
      })
    }

    token = JWT.sign({ id: userData._id }, process.env.SECRET_KEY, {
      expiresIn: '1d',
    })

    res.status(200).json({
      error: false,
      token,
      user: UserRefInterface(userData),
    })
  } catch (err) {
    res.status(500).json({
      error: true,
      message: err.message,
    })
  }
}