const ticketService = require("../service/ticketService.js");

exports.getUserTickets = async (req, res) => {
    try {
        const userId = req.user.id;
        const tickets = await ticketService.getUserTickets(userId);
        res.status(200).json({ success: true, tickets });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.buyTicket = async (req, res) => {
    try {
        const userId = req.user.id;
        const { eventId, ticketType } = req.body;
        const ticket = await ticketService.buyTicket(userId, eventId, ticketType);
        res.status(200).json({ success: true, ticket });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
}

exports.cancelTicket = async (req, res) => {
    try {
        const userId = req.user.id;
        const { ticketId } = req.body;
        const ticket = await ticketService.cancelTicket(ticketId, userId);
        res.status(200).json({ success: true, message: "Ticket cancelled", ticket });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
}

