const router = require("express").Router();
const imageController = require("../controller/imageController.js");

router.get("/gallery", imageController.getGallery);

module.exports = router;
