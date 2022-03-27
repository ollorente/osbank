// @ts-check
const EntryModel = require("../model");
const { EntryRefInterface } = require("../dtos");
const { MonthModel } = require("../../month");
const { UserModel } = require("../../user");

module.exports = async (req, res, next) => {
  const { amount, detail, month, year } = req.body;

  const userAuth = await UserModel.findById(req.user.id);

  if (!userAuth)
    return res.status(400).json({
      error: true,
      message: "Access denied.",
    });

  const monthData = await MonthModel.findOne({
    order: month,
  });

  if (!monthData)
    return res.status(400).json({
      error: true,
      message: "Month not exists.",
    });

  let result;
  try {
    const newData = new EntryModel({
      amount,
      detail,
      monthId: monthData._id,
      year,
      userId: userAuth._id,
    });

    result = await newData.save();

    res.status(201).json({
      error: false,
      data: EntryRefInterface(result),
    });
  } catch (err) {
    res.status(500).json({
      error: true,
      message: err.message,
    });
  }
};
