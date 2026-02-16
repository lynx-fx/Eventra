const Ticket = require("../model/Tickets.js");
const Event = require("../model/Events.js");

exports.getUserTickets = async (userId) => {
    return await Ticket.find({ userId }).populate('eventId');
};

exports.buyTicket = async (userId, eventId, ticketType = 'standard') => {
    // Check if event exists
    const event = await Event.findById(eventId);
    if (!event) {
        throw new Error("Event not found");
    }

    // Check if ticket sales have started/ended
    const now = new Date();
    if (now < event.startDate) {
        throw new Error("Ticket sales have not started yet");
    }
    if (now > event.endDate) {
        throw new Error("Ticket sales have ended for this event");
    }

    // Check capacity for the selected ticket type
    const capacity = event.capacity[ticketType] || 0;
    const sold = event.soldTickets[ticketType] || 0;

    if (sold >= capacity) {
        throw new Error(`${ticketType.charAt(0).toUpperCase() + ticketType.slice(1)} tickets are sold out`);
    }

    // Get price for the selected ticket type
    const finalPrice = event.price[ticketType] || 0;

    // Create ticket
    const ticket = new Ticket({
        userId,
        eventId,
        ticketType,
        price: finalPrice,
        status: 'active'
    });

    // Update event sold tickets count
    event.soldTickets[ticketType] += 1;

    await Promise.all([
        ticket.save(),
        event.save()
    ]);

    return ticket;
};

exports.cancelTicket = async (ticketId, userId) => {
    const ticket = await Ticket.findOne({ _id: ticketId, userId });
    if (!ticket) {
        throw new Error("Ticket not found or unauthorized");
    }

    if (ticket.status === 'cancelled') {
        throw new Error("Ticket is already cancelled");
    }

    const event = await Event.findById(ticket.eventId);
    if (event) {
        // Decrease sold tickets count
        const ticketType = ticket.ticketType || 'standard';
        if (event.soldTickets[ticketType] > 0) {
            event.soldTickets[ticketType] -= 1;
        }
        await event.save();
    }

    ticket.status = 'cancelled';
    await ticket.save();
    return ticket;
}
