const bcrypt = require("bcryptjs");
const JWT = require("jsonwebtoken");

const UserModel = require("../model");
const { UserRefInterface } = require("../dtos");

module.exports = async (req, res, next) => {
  const { username } = req.body;

  try {
    const userData = await UserModel.findOne({
      $or: [
        {
          email: username,
        },
        {
          phone: username,
        },
      ],
    });

    if (!userData) {
      return res.status(400).json({
        error: true,
        message: "Username or password in wrong!",
      });
    }

    const isValidPass = await bcrypt.compare(
      req.body.password,
      userData.password
    );

    if (!isValidPass) {
      return res.status(400).json({
        error: true,
        message: "Username or password in wrong!",
      });
    }

    token = JWT.sign(
      {
        id: userData._id,
      },
      process.env.SECRET_KEY,
      {
        expiresIn: "7d",
      }
    );

    res.status(200).json({
      error: false,
      token,
      user: UserRefInterface(userData),
    });
  } catch (err) {
    res.status(500).json({
      error: true,
      message: err.message,
    });
  }
};
