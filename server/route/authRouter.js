const express = require("express");
const router = express.Router();
const authController = require("../controller/authController.js");

router.post("/login", authController.login);
router.post("/signup", authController.signup);
router.post("/reset-password", authController.resetPassword);
router.get("/forgot-password", authController.forgotPassword);
router.get("/validate-token", authController.validateToken);

module.exports = router;