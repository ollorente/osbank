// @ts-check
const ItemModel = require("../model");
const { UserModel } = require("../../user");

module.exports = async (req, res, next) => {
  const { id } = req.params;

  const userAuth = await UserModel.findById(req.user.id);
  if (!userAuth) {
    return res.status(400).json({
      error: `Access denied.`,
    });
  }

  const itemData = await ItemModel.findOne({ _id: id, userId: userAuth._id });
  if (!itemData) {
    return res.status(400).json({
      error: `Item not exists.`,
    });
  }

  let result;
  try {
    result = await ItemModel.deleteOne({
      _id: itemData._id,
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
