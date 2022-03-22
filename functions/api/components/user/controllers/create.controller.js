// @ts-check
const UserModel = require('../model')
const { UserRefInterface } = require('../dtos')
const { registerValidation } = require('../../../utils/validation')

module.exports = async (req, res, next) => {
  let result
  try {
    /* Validate data */
    const { error } = registerValidation(req.body)
    if (error) return res.status(400).json(error.details[0].message)

    /* Checking if the user is already in the database */
    const emailExist = await UserModel.findOne({
      email: req.body.email
    })
    if (emailExist) {
      return res.status(400).json({
        error: `Email already exist!`
      })
    }

    const phoneExist = await UserModel.findOne({
      phone: req.body.phone
    })
    if (phoneExist) {
      return res.status(400).json({
        error: `Phone already exist!`
      })
    }

    const newData = new UserModel({
      name: req.body.name,
      phone: req.body.phone,
      email: req.body.email.toLowerCase(),
      password: req.body.password
    })

    result = await newData.save()

    res.status(201).json({
      error: false,
      data: UserRefInterface(result)
    })
  } catch (error) {
    next(error)
  }
}