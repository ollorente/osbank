// @ts-check
const EntryModel = require("../model");
const { EntryRefInterface } = require("../dtos");
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
    userId: userAuth._id,
    isActive: true,
    isLock: false,
  };

  let result, count;
  try {
    result = await EntryModel.find(Options).limit(P.limit).skip(P.page).sort({
      createdAt: -1,
    });

    count = await EntryModel.countDocuments(Options);

    res.status(200).json({
      error: false,
      count,
      data: count > 0 ? result.map((e) => EntryRefInterface(e)) : [],
    });
  } catch (err) {
    res.status(500).json({
      error: true,
      message: err.message,
    });
  }
};
