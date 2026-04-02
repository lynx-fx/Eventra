const ticketService = require("../service/ticketService.js");

exports.getUserTickets = async (req, res) => {
    try {
        const userId = req.user.id;
        const tickets = await ticketService.getUserTickets(userId);
        res.status(200).json({ success: true, tickets });
    } catch (err) {
        console.log(err.message);
        if (err.status) {
            return res.status(err.status).json({ success: false, message: err.message });
        }
        res.status(500).json({ success: false, message: "Error while fetching user's ticket" });
    }
};

// DONE: verify
exports.buyTicket = async (req, res) => {
    try {
        const userId = req.user.id;
        const { eventId, ticketType, seatCount } = req.body;
        const { paymentData } = await ticketService.buyTicket(userId, eventId, ticketType, seatCount);
        res.status(200).json({ success: true, paymentData });
    } catch (err) {
        console.log(err.message);
        if (err.status) {
            return res.status(err.status).json({ success: false, message: err.message });
        }
        res.status(500).json({ success: false, message: "Error while purchasing ticket" });    }
}

exports.verifyTicket = async (req, res) => {
    try {
        const { data } = req.body;
        const ticket = await ticketService.verifyTicket(data);
        res.status(200).json({ success: true, ticket });
    } catch (err) {
        console.log(err);
        console.log(err.message);
        if (err.status) {
            return res.status(err.status).json({ success: false, message: err.message });
        }
        res.status(500).json({ success: false, message: "Error while verifying ticket" });    }
}

exports.cancelTicket = async (req, res) => {
    try {
        const userId = req.user.id;
        const { ticketId } = req.body;
        const ticket = await ticketService.cancelTicket(ticketId, userId);
        res.status(200).json({ success: true, message: "Ticket cancelled", ticket });
    } catch (err) {
        console.log(err.message);
        if (err.status) {
            return res.status(err.status).json({ success: false, message: err.message });
        }
        res.status(500).json({ success: false, message: "Error while cancelling ticket" });    }
}

exports.completePurchase = async (req, res) => {
    try {
        const userId = req.user.id;
        const { ticketId } = req.body;
        const { paymentData } = await ticketService.completePurchase(ticketId, userId);
        res.status(200).json({ success: true, paymentData });
    } catch (err) {
        console.log(err.message);
        if (err.status) {
            return res.status(err.status).json({ success: false, message: err.message });
        }
        res.status(500).json({ success: false, message: "Error while completing purchase" });    }
}

exports.getSellerTickets = async (req, res) => {
    try {
        const sellerId = req.user.id;
        const tickets = await ticketService.getTicketsBySeller(sellerId);
        res.status(200).json({ success: true, tickets });
    } catch (err) {
        console.log(err.message);
        if (err.status) {
            return res.status(err.status).json({ success: false, message: err.message });
        }
        res.status(500).json({ success: false, message: "Error while fetching seller's event" });    }
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
        console.log(err.message);
        if (err.status) {
            return res.status(err.status).json({ success: false, message: err.message });
        }
        res.status(500).json({ success: false, message: "Erro while getting ticket details" });    }
}

exports.useTicket = async (req, res) => {
    try {
        const { ticketId } = req.body;
        const userId = req.user.id;
        const userRole = req.user.role;
        const ticket = await ticketService.useTicket(ticketId, userId, userRole);
        res.status(200).json({ success: true, message: "Ticket used successfully", ticket });
    } catch (err) {
        console.log(err.message);
        if (err.status) {
            return res.status(err.status).json({ success: false, message: err.message });
        }
        res.status(500).json({ success: false, message: "Error while using ticket" });    }
}
