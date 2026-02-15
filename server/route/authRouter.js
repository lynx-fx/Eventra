const express = require("express");
const router = express.Router();
const authController = require("../controller/authController.js");

const { protect } = require("../middleware/authMiddleware.js");

router.get("/forgot-password", authController.forgotPassword);
router.get("/validate-token", authController.validateToken);
router.get("/get-me", protect, authController.getCurrentUser);
router.post("/login", authController.login);
router.post("/google-login", authController.googleLogin);
router.post("/signup", authController.signup);
router.post("/reset-password", authController.resetPassword);

module.exports = router;