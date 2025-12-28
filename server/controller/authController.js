const jwt = require("jsonwebtoken");
const { hash, compare } = require("bcryptjs");
const { createHmac } = require("crypto");

const { welcomeMail } = require("../util/mailtemplate.js")

const tokenExtractor = require("../util/tokenExtractor.js");
const User = require("../model/Users.js");

const { oauth2client } = require("../util/googleConfig.js");


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

    const hashedPassword = await hash(password, SALT_VALUE);

    const newUser = new User({
      userName,
      email,
      password: hashedPassword,
      userRole,
    });
    await newUser.save();

    welcomeMail(userName);

    res.status(200).json({
      success: true,
      message: "Account created",
      redirect: "/auth/login",
    });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ success: false, message: "Error while signing up." });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email }).select("+password");
    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: `User with ${email} doesn't exists.`,
      });
    }
    const result = await compare(password, existingUser.password);
    if (!result) {
      return res
        .status(401)
        .json({ success: false, message: "Incorrect username or password" });
    }

    const token = jwt.sign(
      {
        id: existingUser.id,
      },
      process.env.TOKEN_SECRET,
      {
        expiresIn: "168hours",
      }
    );

    return res.status(200).json({
      success: true,
      message: "Logged in",
      redirect: "/dashboard",
      token,
    });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ success: false, message: "Error while logging in." });
  }
};

exports.googleLogin = async (req, res) => {
  try {
    const { code } = req.body;
    const googleResponse = await oauth2client.getToken(code);
    oauth2client.setCredentials(googleResponse.tokens);

    const userRes = await fetch(
      `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${googleResponse.tokens.access_token}`,
      {
        method: "GET",
      }
    );

    const { email, name, picture } = await userRes.json();

    if (!email.endsWith(ALLOWED_DOMAIN)) {
      return res
        .status(403)
        .json({ success: false, message: `${ALLOWED_DOMAIN} is accepted.` });
    }

    let user = await User.findOne({ email });
    if (!user) {
      const newUser = new User({
        email,
        name,
        profileUri: picture,
      });
      await newUser.save();

      const token = jwt.sign(
        {
          id: newUser._id,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: process.env.JWT_TIMEOUT,
        }
      );

      return res.status(200).json({ success: true, message: "Account created and logged in", redirect: "/dashboard", token })

    } else {
      const token = jwt.sign(
        {
          id: user._id,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: process.env.JWT_TIMEOUT,
        }
      );

      return res.status(200).json({ success: true, message: "Logged in", redirect: "/dashboard", token })
    }
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Error while logging in",
      error: err.message,
    });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.query;
    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: `User with ${email} doesn't exists.`,
      });
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();

    const frontend =
      process.env.NODE_ENV === "production"
        ? process.env.FRONT_END_HOSTED
        : process.env.FRONT_END_LOCAL;

    const link = `${frontend}/auth/reset-password?email=${encodeURIComponent(
      email
    )}&token=${code}`;

    let mail = await transport.sendMail({
      from: process.env.EMAIL,
      to: email,
      subject: "Reset Your Password",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f4f4;">
          <div style="max-width: 500px; background: white; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);"> 
            <h2 style="color: #333; text-align: center;">Reset Your Password</h2>
            <p style="color: #555;">You requested a password reset. Click the button below to reset your password. This link will expire in <strong>10 minutes</strong>.</p>
            <div style="text-align: center; margin: 20px 0;">
              <a href="${link}" 
                 style="background-color: #007bff; color: white; text-decoration: none; padding: 10px 20px; border-radius: 5px; display: inline-block;">
                 Reset Password
              </a>
            </div>
            <p style="color: #555;">If you didn’t request this, please ignore this email.</p>
            <hr style="border: none; border-top: 1px solid #ddd;">
            <p style="color: #777; font-size: 12px; text-align: center;">&copy; ${new Date().getFullYear()} Eventra. All rights reserved.</p>
          </div>
        </div>
      `,
    });

    if (mail.accepted.length > 0) {
      const hashedCode = createHmac("sha256", process.env.HMAC_CODE)
        .update(code)
        .digest("hex");
      existingUser.authCode = hashedCode;
      existingUser.save();

      return res.status(200).json({
        success: true,
        message: `Password reset link sent to ${email}.`,
      });
    } else {
      return res
        .status(500)
        .json({ success: false, message: "Couldn't sent mail." });
    }
  } catch (err) {
    console.log(err.message);
    return res
      .status(500)
      .json({ success: false, message: "Error while generating token." });
  }
};

// TODO: Check for security flaw
exports.validateToken = async (req, res) => {
  try {
    const { email, token } = req.query;

    const existingUser = await User.findOne({ email }).select("+authCode");
    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: `User with ${email} doesn't exists.`,
      });
    }

    // Checking code validity
    if (new Date() - existingUser.updatedAt > 10 * 60 * 1000) {
      return res
        .status(401)
        .json({ success: false, message: "Token expired, retry." });
    }

    // checking token
    if (
      createHmac("sha256", process.env.HMAC_CODE)
        .update(token)
        .digest("hex") === existingUser.authCode
    ) {
      return res.status(200).json({ success: true });
    } else {
      return res
        .status(401)
        .json({ success: false, message: "Invalid token." });
    }
  } catch (err) {
    console.log(err.message);
    return res
      .status(500)
      .json({ success: false, message: "Error while validating token." });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { email, password, token } = req.body;

    const existingUser = await User.findOne({ email }).select(
      "+password +authCode"
    );
    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: `User with ${email} doesn't exists.`,
      });
    }

    // Revaidating token and removing it afterwards
    if (new Date() - existingUser.updatedAt > 10 * 60 * 1000) {
      return res
        .status(401)
        .json({ success: false, message: "Token expired, retry." });
    }

    // checking token
    if (
      createHmac("sha256", process.env.HMAC_CODE)
        .update(token)
        .digest("hex") === existingUser.authCode
    ) {
      existingUser.password = await hash(password, SALT_VALUE);
      existingUser.authCode = "";
      await existingUser.save();
    } else {
      return res
        .status(401)
        .json({ success: false, message: "Invalid token." });
    }

    return res
      .status(200)
      .json({ success: true, message: "Password changed successfully.", redirect: "/auth/login" });
  } catch (err) {
    console.log(err.message);
    return res
      .status(500)
      .json({ success: false, message: "Error while reseting password." });
  }
};
