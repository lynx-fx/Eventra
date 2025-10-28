const express = require("express");
const router = express.Router();
const authController = require("../controller/authController.js");

router.get("/signup", authController.signup);

module.exports = router;