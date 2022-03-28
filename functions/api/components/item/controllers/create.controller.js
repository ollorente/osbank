// @ts-check
const ItemModel = require("../model");
const { ItemRefInterface } = require("../dtos");
const { UserModel } = require("../../user");

module.exports = async (req, res, next) => {
  const { name, icon } = req.body;

  const userAuth = await UserModel.findById(req.user.id);
  if (!userAuth)
    return res.status(400).json({
      error: true,
      message: "Access denied.",
    });

  const itemData = await ItemModel.findOne({
    name: name,
    userId: userAuth._id,
  });
  if (itemData)
    return res.status(400).json({
      error: true,
      message: "Item exists.",
    });

  let result;
  try {
    const newData = new ItemModel({
      name,
      icon,
      userId: userAuth.Id,
    });

    result = await newData.save();

    res.status(201).json({
      error: false,
      data: ItemRefInterface(result),
    });
  } catch (err) {
    res.status(500).json({
      error: true,
      message: err.message,
    });
  }
};
