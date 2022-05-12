// @ts-check
const { MonthInterface } = require('../dtos')
const MonthModel = require('../model')

module.exports = async (req, res, next) => {
  const { id } = req.params

  let result
  try {
    result = await MonthModel.findOne({ order: id })

    res.status(200).json({
      error: false,
      data: result ? MonthInterface(result) : null
    })
  } catch (err) {
    res.status(500).json({
      error: true,
      message: err.message
    })
  }
}
