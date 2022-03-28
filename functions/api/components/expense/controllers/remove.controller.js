// @ts-check
const ExpenseModel = require("../model");
const { UserModel } = require("../../user");

module.exports = async (req, res, next) => {
  const { id } = req.params;

  const userAuth = await UserModel.findById(req.user.id);
  if (!userAuth) {
    return res.status(400).json({
      error: `Access denied.`,
    });
  }

  const expenseData = await ExpenseModel.findOne({
    _id: id,
    userId: userAuth.id,
  });
  if (!expenseData) {
    return res.status(400).json({
      error: `Expense not exists.`,
    });
  }

  let result;
  try {
    result = await ExpenseModel.deleteOne({
      _id: expenseData._id,
    });

    await UserModel.findOneAndUpdate(
      {
        _id: userAuth._id,
      },
      {
        $inc: {
          expense: -expenseData.amount,
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
