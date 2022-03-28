// @ts-check
const EstimateModel = require("../model");
const { EstimateRefInterface } = require("../dtos");
const { UserModel } = require("../../user");
const Paginator = require("../../../utils/paginator");

module.exports = async (req, res, next) => {
  const { limit, page } = req.query;
  const P = Paginator(limit, page);

  const userAuth = await UserModel.findById(req.user.id);
  if (!userAuth) {
    return res.status(400).json({
      error: `Access denied.`,
    });
  }

  const Options = {
    isActive: true,
    userId: userAuth._id,
  };

  let result, count;
  try {
    result = await EstimateModel.find(Options)
      .populate([
        {
          path: "monthId",
        },
      ])
      .limit(P.limit)
      .skip(P.page)
      .sort({
        createdAt: -1,
      });

    count = await EstimateModel.countDocuments(Options);

    res.status(200).json({
      error: false,
      count,
      data: count > 0 ? result.map((e) => EstimateRefInterface(e)) : [],
    });
  } catch (err) {
    res.status(500).json({
      error: true,
      message: err.message,
    });
  }
};
