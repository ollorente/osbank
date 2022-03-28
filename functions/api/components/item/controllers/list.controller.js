// @ts-check
const ItemModel = require("../model");
const { ItemRefInterface } = require("../dtos");
const { UserModel } = require("../../user");
const Paginator = require("../../../utils/paginator");

module.exports = async (req, res, next) => {
  const { limit, page } = req.query;
  const P = Paginator(limit, page);

  const userAuth = await UserModel.findById(req.user.id);
  if (!userAuth)
    return res.status(400).json({
      error: true,
      message: "Access denied.",
    });

  const Options = {
    isActive: true,
    userId: userAuth._id,
  };

  let result, count;
  try {
    result = await ItemModel.find(Options).limit(P.limit).skip(P.page).sort({
      name: 1,
    });

    count = await ItemModel.countDocuments(Options);

    res.status(200).json({
      error: false,
      count,
      data: count > 0 ? result.map((e) => ItemRefInterface(e)) : [],
    });
  } catch (err) {
    res.status(500).json({
      error: true,
      message: err.message,
    });
  }
};
