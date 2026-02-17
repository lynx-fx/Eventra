const router = require("express").Router();
const adminController = require("../controller/adminController.js");
const { protect, adminOnly } = require("../middleware/authMiddleware.js");

// All routes should be protected and only for admins
// All routes should be protected and only for admins
router.get("/analytics", protect, adminOnly, adminController.getAnalytics);
router.get("/users", protect, adminOnly, adminController.getAllUsers);
router.get("/reports", protect, adminOnly, adminController.getAllReports);
// Update report status
router.patch("/reports/:id", protect, adminOnly, adminController.resolveReport);
router.patch("/users/:id/ban", protect, adminOnly, adminController.banUser);
router.get("/users/:id/history", protect, adminOnly, adminController.getUserReportHistory);
// Add new admin
router.post("/users/admin", protect, adminOnly, adminController.addAdmin);

module.exports = router;
