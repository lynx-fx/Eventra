const jwt = require("jsonwebtoken");
const { hash, compare } = require("bcryptjs");

const tokenExtractor = require("../util/tokenExtractor.js");
const User = require("../model/userModel.js");

const SALT_VALUE = 12;
exports.signup = async (req, res) => {
  try {
    const { userName, email, password, userRole } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: `User already exists with ${email}` });
    }

    password = hash(password, SALT_VALUE);

    const newUser = new User({
      userName,
      email,
      password,
      userRole,
    });
    await newUser.save();
    res.status(200).json({
      success: true,
      message: "Account created",
      newUser,
    });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ success: false, message: "Error when signing up." });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const existingUser = await findOne({ email }).select("+password");
    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: `User with ${email} doesn't exists.`,
      });
    }
    const result = await compare(password, existingUser.password);
    if (!result) {
      return res
        .status(402)
        .json({ success: false, message: "Incorrect username or password" });
    }

    const token = jwt.sign(
      {
        id: existingUser.id,
        email: existingUser.email,
      },
      process.env.TOKEN_SECRET,
      {
        expiresIn: "168hours",
      }
    );

    return res
      .cookie("auth", token, {
        httpOnly: process.env.NODE_ENV == "production" ? true : false,
        secure: process.env.NODE_ENV == "production" ? true : false,
        sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
        expires: new Date(Date.now() + 86400000),
      })
      .json({ success: true, message: "Logged in", redirect: "/dashboard" });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ success: false, message: "Error while logging in." });
  }
};
