const router = require("express").Router();
const ticketController = require("../controller/ticketController.js");
const { protect, adminOrSeller } = require("../middleware/authMiddleware.js");

router.get("/", protect, ticketController.getUserTickets);
router.post("/buy", protect, ticketController.buyTicket);
router.post("/verify", protect, ticketController.verifyTicket);
router.post("/cancel", protect, ticketController.cancelTicket);
router.post("/complete", protect, ticketController.completePurchase);
router.get("/seller/sales", protect, ticketController.getSellerTickets);
router.get("/:id", ticketController.getTicketById);
router.post("/use", protect, adminOrSeller, ticketController.useTicket);

module.exports = router;
