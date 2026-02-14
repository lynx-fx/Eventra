const router = require("express").Router();
const eventController = require("../controller/eventController.js");
const { protect } = require("../middleware/authMiddleware.js");

// Public routes
router.get("/", eventController.getAllEvents);
router.get("/upcoming", eventController.getUpcoming);
router.get("/:id", eventController.getEventById);

// Protected routes (e.g. create event - maybe admin only in future?)
router.post("/", protect, eventController.createEvent);
router.delete("/:id", protect, eventController.deleteEvent);
router.patch("/:id/status", protect, eventController.updateEventStatus);

module.exports = router;
