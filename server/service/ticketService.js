const Ticket = require("../model/Tickets.js");
const Event = require("../model/Events.js");

exports.getUserTickets = async (userId) => {
    return await Ticket.find({ userId }).populate('eventId');
};

exports.buyTicket = async (userId, eventId) => {
    // Check if event exists
    const event = await Event.findById(eventId);
    if (!event) {
        throw new Error("Event not found");
    }

    // Basic logic: Create ticket
    // In a real app, we would handle payment processing here
    const ticket = new Ticket({
        userId,
        eventId,
        status: 'active'
    });
    await ticket.save();
    return ticket;
};

exports.cancelTicket = async (ticketId, userId) => {
    const ticket = await Ticket.findOne({ _id: ticketId, userId });
    if (!ticket) {
        throw new Error("Ticket not found or unauthorized");
    }
    ticket.status = 'cancelled';
    await ticket.save();
    return ticket;
}
