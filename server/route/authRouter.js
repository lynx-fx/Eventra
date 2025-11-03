const express = require("express");
const router = express.Router();
const authController = require("../controller/authController.js");

router.post("/login", authController.signup);
router.post("/signup", authController.signup);

module.exports = router;