// @ts-check
const MonthModel = require("../model");
const { MonthRefInterface } = require("../dtos");
const { UserModel } = require("../../user");

module.exports = async (req, res, next) => {
  const { name, order, start, end } = req.body;

  const userAuth = await UserModel.findById(req.user.id);

  if (!userAuth)
    return res.status(400).json({
      error: true,
      message: "Access denied.",
    });

  const monthData = await MonthModel.findOne({ name: name});

  if (monthData)
    return res.status(400).json({
      error: true,
      message: "Month exists.",
    });

  let result;
  try {
    const newData = new MonthModel({
      name,
      order,
      start,
      end,
    });

    result = await newData.save();

    res.status(201).json({
      error: false,
      data: MonthRefInterface(result),
    });
  } catch (err) {
    res.status(500).json({
      error: true,
      message: err.message,
    });
  }
};
