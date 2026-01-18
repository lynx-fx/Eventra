const router = require("express").Router();
const ticketController = require("../controller/ticketController.js");
const { protect } = require("../middleware/authMiddleware.js");

router.get("/", protect, ticketController.getUserTickets);
router.post("/buy", protect, ticketController.buyTicket);
router.post("/cancel", protect, ticketController.cancelTicket);

module.exports = router;
