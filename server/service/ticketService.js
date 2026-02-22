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
    console.log(now);
    console.log(event.startDate);
    console.log(event.endDate);
    
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
        status: 'active',
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

exports.getTicketsBySeller = async (sellerId) => {
    // 1. Find all events created by this seller
    const events = await Event.find({ seller: sellerId });
    const eventIds = events.map(event => event._id);

    // 2. Find all tickets for these events
    const tickets = await Ticket.find({ eventId: { $in: eventIds } })
        .populate('userId', 'name email profileUrl') // Get buyer details
        .populate('eventId', 'title eventDate price'); // Get event details

    return tickets;
};

exports.getTicketById = async (ticketId) => {
    return await Ticket.findById(ticketId)
        .populate('eventId')
        .populate('userId', 'name email profileUrl');
};

exports.useTicket = async (ticketId, userId, userRole) => {
    const ticket = await Ticket.findById(ticketId).populate('eventId');
    if (!ticket) {
        throw new Error("Ticket not found");
    }

    if (ticket.status !== 'active') {
        throw new Error(`Ticket is already ${ticket.status}`);
    }

    // Check if user is the seller of this event
    if (ticket.eventId.seller.toString() !== userId) {
        throw new Error("Unauthorized: Only the event seller can mark this ticket as used");
    }

    const now = new Date();
    const eventDate = new Date(ticket.eventId.eventDate);

    // Normalize to compare dates only (ignore time)
    const currentDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const normalizedEventDate = new Date(eventDate.getFullYear(), eventDate.getMonth(), eventDate.getDate());

    if (currentDate.getTime() !== normalizedEventDate.getTime()) {
        throw new Error("Cannot use ticket: Event date does not match current date");
    }

    ticket.status = 'used';
    await ticket.save();
    return ticket;
};
