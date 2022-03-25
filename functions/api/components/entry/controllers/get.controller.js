// @ts-check
const { EntryInterface } = require("../dtos");
const EntryModel = require("../model");

module.exports = async (req, res, next) => {
  let result;
  try {
    result = await EntryModel.findById(req.params.id);

    res.status(200).json({
      error: false,
      data: result ? EntryInterface(result) : null,
    });
  } catch (err) {
    res.status(500).json({
      error: true,
      message: err.message,
    });
  }
};
