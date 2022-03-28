// @ts-check
const bcrypt = require("bcryptjs");

const UserModel = require("../model");
const { UserInterface } = require("../dtos");

module.exports = async (req, res, next) => {
  const update = {
    name: req.body.name,
    password: req.body.password,
    phone: req.body.phone,
    isActive: req.body.isActive,
    isLock: req.body.isLock,
  };

  const userData = await UserModel.findById(req.user.id);
  if (!userData) {
    return res.status(400).json({
      error: `User not found!.`,
    });
  }

  let result;
  try {
    if (update.password) {
      const hash = await bcrypt.hash(update.password, 10);
      update.password = hash;
    }

    // if (update.phone) {
    //   const phoneData = await UserModel.findOne({ phone:  });
    //   if (!phoneData) {
    //     return res.status(400).json({
    //       error: `User not found!.`,
    //     });
    //   }

    //   update.password = hash;
    // }

    result = await UserModel.findOneAndUpdate(
      {
        _id: userData._id,
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
      data: UserInterface(result),
    });
  } catch (err) {
    res.status(500).json({
      error: true,
      message: err.message,
    });
  }
};
