// @ts-check
const EntryModel = require("../model");
const { UserModel } = require("../../user");

module.exports = async (req, res, next) => {
  const { id } = req.params;

  const userAuth = await EntryModel.findById(req.user.id);

  if (!userAuth) {
    return res.status(400).json({
      error: `Access denied.`,
    });
  }

  const entryData = await EntryModel.findOne({
    _id: id,
    userId: userAuth._id,
  });

  if (!entryData) {
    return res.status(400).json({
      error: `Entry not exists or access denied.`,
    });
  }

  let result;
  try {
    result = await EntryModel.deleteOne({
      _id: entryData._id,
    });

    await UserModel.findOneAndUpdate(
      {
        _id: userAuth._id,
      },
      {
        $inc: {
          total: -entryData.amount,
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
