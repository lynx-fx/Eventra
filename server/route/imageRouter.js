const router = require("express").Router();
const imageController = require("../controller/imageController.js");
const { protect } = require("../middleware/authMiddleware.js");
const upload = require("../middleware/multer.js");

router.get("/gallery", imageController.getGallery);
router.post("/upload", protect, upload.single("image"), imageController.uploadImage);
router.post("/report", protect, imageController.reportImage);

module.exports = router;
