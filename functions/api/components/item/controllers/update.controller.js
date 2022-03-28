// @ts-check
const ItemModel = require("../model");
const { ItemInterface } = require("../dtos");
const { UserModel } = require("../../user");

module.exports = async (req, res, next) => {
  const { id } = req.params;
  const update = {
    name: req.body.name,
    icon: req.body.icon,
    isActive: req.body.isActive,
  };

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
    result = await ItemModel.findOneAndUpdate(
      {
        _id: itemData._id,
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
      data: ItemInterface(result),
    });
  } catch (err) {
    res.status(500).json({
      error: true,
      message: err.message,
    });
  }
};
