// @ts-check
const MonthModel = require("../model");
const { UserModel } = require("../../user");

module.exports = async (req, res, next) => {
  const { id } = req.params;

  const userAuth = await UserModel.findById(req.user.id);

  if (!userAuth) {
    return res.status(400).json({
      error: `Access denied.`,
    });
  }

  const monthData = await MonthModel.findOne({ order: id });

  if (!monthData) {
    return res.status(400).json({
      error: `Month not exists.`,
    });
  }

  let result;
  try {
    result = await MonthModel.deleteOne({
      _id: monthData._id,
    });

    res.status(200).json({
      error: false,
      data: result,
    });
  } catch (err) {
    res.status(500).json({
      error: true,
      message: err.message,
    });
  }
};
