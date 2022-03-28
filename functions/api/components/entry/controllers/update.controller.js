// @ts-check
const EntryModel = require("../model");
const { EntryInterface } = require("../dtos");
const { UserModel } = require("../../user");

module.exports = async (req, res, next) => {
  const { id } = req.params;
  const update = {
    detail: req.body.detail,
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
    result = await EntryModel.findOneAndUpdate(
      {
        _id: entryData._id,
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
      data: EntryInterface(result),
    });
  } catch (err) {
    res.status(500).json({
      error: true,
      message: err.message,
    });
  }
};
