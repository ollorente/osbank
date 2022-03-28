// @ts-check
const EstimateModel = require("../model");
const { EstimateInterface } = require("../dtos");
const { ItemModel } = require("../../item");
const { MonthModel } = require("../../month");
const { UserModel } = require("../../user");

module.exports = async (req, res, next) => {
  const { id } = req.params;
  const update = {
    name: req.body.name,
    item: req.body.item,
    month: req.body.month,
    year: req.body.year,
    isActive: req.body.isActive,
  };

  const userAuth = await UserModel.findById(req.user.id);
  if (!userAuth) {
    return res.status(400).json({
      error: `Access denied.`,
    });
  }

  const estimateData = await EstimateModel.findOne({
    _id: id,
    userId: userAuth.id,
  });
  if (!estimateData) {
    return res.status(400).json({
      error: `Estimate not exists.`,
    });
  }

  let result;
  try {
    if (update.item) {
      const itemData = await ItemModel.findOne({
        _id: update.item,
        userId: userAuth.id,
      });
      if (!itemData) {
        return res.status(400).json({
          error: `Item not exists.`,
        });
      }

      update.itemId = itemData._id;
    }

    if (update.month) {
      const monthData = await MonthModel.findOne({ order: update.month });
      if (!monthData) {
        return res.status(400).json({
          error: `Month not exists.`,
        });
      }

      update.monthId = monthData._id;
    }

    result = await EstimateModel.findOneAndUpdate(
      {
        _id: estimateData._id,
      },
      {
        $set: update,
      },
      {
        new: true,
      }
    );

    res.status(200).json({
      error: false,
      data: EstimateInterface(result),
    });
  } catch (err) {
    res.status(500).json({
      error: true,
      message: err.message,
    });
  }
};
