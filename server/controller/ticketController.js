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

// TODO: verify
exports.buyTicket = async (req, res) => {
    try {
        const userId = req.user.id;
        const { eventId, ticketType } = req.body;
        const { paymentData } = await ticketService.buyTicket(userId, eventId, ticketType);
        res.status(200).json({ success: true, paymentData });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
}

exports.verifyTicket = async (req, res) => {
    try {
        const userId = req.user.id;
        const { eventId } = req.body;
        const ticket = await ticketService.verifyTicket(userId, eventId);
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

exports.getSellerTickets = async (req, res) => {
    try {
        const sellerId = req.user.id;
        const tickets = await ticketService.getTicketsBySeller(sellerId);
        res.status(200).json({ success: true, tickets });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
}


exports.getTicketById = async (req, res) => {
    try {
        const { id } = req.params;
        const ticket = await ticketService.getTicketById(id);
        if (!ticket) {
            return res.status(404).json({ success: false, message: "Ticket not found" });
        }
        res.status(200).json({ success: true, ticket });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
}

exports.useTicket = async (req, res) => {
    try {
        const { ticketId } = req.body;
        const userId = req.user.id;
        const userRole = req.user.role;
        const ticket = await ticketService.useTicket(ticketId, userId, userRole);
        res.status(200).json({ success: true, message: "Ticket used successfully", ticket });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
}
