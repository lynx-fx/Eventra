const express = require("express");
const router = express.Router();
const authController = require("../controller/authController.js");

router.post("/login", authController.login);
router.post("/signup", authController.signup);
router.get("/forgot-password", authController.forgotPassword);
router.get("/reset-password", authController.resetPassword);

module.exports = router;