const userService = require("../service/userService.js");

exports.signup = async (req, res) => {
  try {
    const { name, email, password, userRole } = req.body;
    const result = await userService.signup(name, email, password, userRole);

    res.status(200).json({
      success: true,
      message: result.message,
      redirect: "/auth/login",
    });
  } catch (err) {
    console.log(err);
    if (err.message.includes("already exists")) {
      return res
        .status(400)
        .json({ success: false, message: err.message });
    }
    return res
      .status(500)
      .json({ success: false, message: "Error while signing up." });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await userService.login(email, password);

    return res.status(200).json({
      success: true,
      message: "Logged in",
      redirect: "/dashboard",
      token: result.token,
    });
  } catch (err) {
    console.log(err);
    if (err.message.includes("doesn't exists")) {
      return res.status(404).json({
        success: false,
        message: err.message,
      });
    }
    if (err.message.includes("Try google login")) {
      return res.status(400).json({
        success: false,
        message: err.message
      })
    }
    if (err.message.includes("Incorrect username or password")) {
      return res
        .status(401)
        .json({ success: false, message: err.message });
    }

    if (err.message.includes("Your account has been banned")) {
      return res.status(403).json({ success: false, message: err.message });
    }

    return res
      .status(500)
      .json({ success: false, message: "Error while logging in." });
  }
};

exports.googleLogin = async (req, res) => {
  try {
    const { code } = req.body;
    const result = await userService.googleLogin(code);

    // Check if new user or existing to decide message (though original code used "Account created and logged in" for new)
    // The service returns isNewUser flag if we want to customize payload
    // Original: 
    // New: "Account created and logged in", redirect: "/dashboard", token
    // Existing: "Logged in", redirect: "/dashboard", token

    const message = result.isNewUser ? "Account created and logged in" : "Logged in";

    return res.status(200).json({ success: true, message, redirect: "/dashboard", token: result.token })

  } catch (err) {
    console.log(err.message);
    if (err.message.includes("Your account has been banned")) {
      return res.status(403).json({ success: false, message: err.message });
    }

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
    await userService.forgotPassword(email);

    return res.status(200).json({
      success: true,
      message: `Password reset link sent to ${email}.`,
    });
  } catch (err) {
    console.log(err.message);
    if (err.message.includes("doesn't exists")) {
      return res.status(404).json({
        success: false,
        message: err.message,
      });
    }
    if (err.message.includes("Couldn't sent mail")) {
      return res
        .status(500)
        .json({ success: false, message: err.message });
    }
    return res
      .status(500)
      .json({ success: false, message: "Error while generating token." });
  }
};

exports.validateToken = async (req, res) => {
  try {
    const { email, token } = req.query;
    await userService.validateToken(email, token);
    return res.status(200).json({ success: true });
  } catch (err) {
    console.log(err.message);
    if (err.message.includes("doesn't exists")) {
      return res.status(404).json({
        success: false,
        message: err.message,
      });
    }
    if (err.message.includes("Token expired") || err.message.includes("Invalid token")) {
      return res
        .status(401)
        .json({ success: false, message: err.message });
    }
    return res
      .status(500)
      .json({ success: false, message: "Error while validating token." });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { email, password, token } = req.body;
    await userService.resetPassword(email, password, token);

    return res
      .status(200)
      .json({ success: true, message: "Password changed successfully.", redirect: "/auth/login" });
  } catch (err) {
    console.log(err.message);
    if (err.message.includes("doesn't exists")) {
      return res.status(404).json({
        success: false,
        message: err.message,
      });
    }
    if (err.message.includes("Token expired") || err.message.includes("Invalid token")) {
      return res
        .status(401)
        .json({ success: false, message: err.message });
    }
    return res
      .status(500)
      .json({ success: false, message: "Error while reseting password." });
  }
};
exports.getCurrentUser = async (req, res) => {
  try {
    const user = await userService.getUserById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    res.status(200).json({ success: true, user });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ success: false, message: "Error fetching user data" });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { name, bio } = req.body;
    const updateData = { name, bio };

    if (req.file) {
      updateData.profileUrl = `/images/${req.file.filename}`;
    } else if (req.body.profileUrl) {
      updateData.profileUrl = req.body.profileUrl;
    }

    const updatedUser = await userService.updateUser(req.user.id, updateData);
    res.status(200).json({ success: true, message: "Profile updated", user: updatedUser });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ success: false, message: "Error updating profile" });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    await userService.changePassword(req.user.id, currentPassword, newPassword);
    res.status(200).json({ success: true, message: "Password changed successfully" });
  } catch (err) {
    console.log(err.message);
    res.status(400).json({ success: false, message: err.message });
  }
};

