// @ts-check
const MonthModel = require('../model')
const { MonthRefInterface } = require('../dtos')
const Paginator = require('../../../utils/paginator')

module.exports = async (req, res, next) => {
  const { limit, page } = req.query
  const P = Paginator(limit, page)
  const Options = {
    isActive: true
  }

  let result, count
  try {
    result = await MonthModel.find(Options).limit(P.limit).skip(P.page).sort({
      order: 1
    })

    count = await MonthModel.countDocuments(Options)

    res.status(200).json({
      error: false,
      count,
      data: count > 0 ? result.map((e) => MonthRefInterface(e)) : []
    })
  } catch (err) {
    res.status(500).json({
      error: true,
      message: err.message
    })
  }
}
