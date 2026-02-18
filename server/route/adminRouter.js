const router = require("express").Router();
const adminController = require("../controller/adminController.js");
const { protect, adminOnly, adminOrSeller } = require("../middleware/authMiddleware.js");

// All routes should be protected
router.get("/analytics", protect, adminOnly, adminController.getAnalytics);
router.get("/users", protect, adminOnly, adminController.getAllUsers);

// Reports - Allow Admin and Seller
router.get("/reports", protect, adminOrSeller, adminController.getAllReports);
// Update report status - Admin only (Subject to clarification, assuming admin resolves)
router.patch("/reports/:id", protect, adminOnly, adminController.resolveReport);

router.patch("/users/:id/ban", protect, adminOnly, adminController.banUser);
router.get("/users/:id/history", protect, adminOnly, adminController.getUserReportHistory);

// Add new admin
router.post("/users/admin", protect, adminOnly, adminController.addAdmin);

// Remove/Restore image - Allow Admin and Seller
router.patch("/images/:id/status", protect, adminOrSeller, adminController.removeImage);

module.exports = router;
