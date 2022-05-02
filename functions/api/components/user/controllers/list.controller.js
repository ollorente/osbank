// @ts-check
const UserModel = require('../model')
const { UserRefInterface } = require('../dtos')
const Paginator = require('../../../utils/paginator')

module.exports = async (req, res, next) => {
  const { limit, page } = req.query
  const P = Paginator(limit, page)

  let result, count
  try {
    result = await UserModel.find({
      isActive: true,
      isLock: false
    })
      .limit(P.limit)
      .skip(P.page)
      .sort({
        name: 1
      })

    count = await UserModel.countDocuments({
      isActive: true,
      isLock: false
    })

    res.status(200).json({
      error: false,
      count,
      data: count > 0 ? result.map((e) => UserRefInterface(e)) : []
    })
  } catch (err) {
    res.status(500).json({
      error: true,
      message: err.message
    })
  }
}
