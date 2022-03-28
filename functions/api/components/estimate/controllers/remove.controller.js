// @ts-check
const EstimateModel = require("../model");
const { UserModel } = require("../../user");

module.exports = async (req, res, next) => {
  const { id } = req.params;

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
    result = await EstimateModel.deleteOne({
      _id: estimateData._id,
    });

    await UserModel.findOneAndUpdate(
      {
        _id: userAuth._id,
      },
      {
        $inc: {
          estimate: -estimateData.amount,
        },
      }
    );

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
