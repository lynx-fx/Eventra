const router = require("express").Router();
const imageController = require("../controller/imageController.js");
const { protect } = require("../middleware/authMiddleware.js");
const upload = require("../middleware/multer.js");

router.get("/gallery", imageController.getGallery);
router.post("/upload", protect, upload.array("images", 10), imageController.uploadImages);
router.post("/report", protect, imageController.reportImage);

module.exports = router;
