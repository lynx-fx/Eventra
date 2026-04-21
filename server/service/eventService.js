const Event = require("../model/Events.js");
const mailtemplate = require("../util/mailtemplate.js");
const Ticket = require("../model/Tickets.js");


class ServiceError extends Error {
    constructor(message, status) {
        super(message);
        this.status = status;
    }
}

exports.getAllEvents = async () => {
    return await Event.find().sort({ eventDate: 1 });
};

exports.getEventsByQuery = async (query) => {
    return await Event.find(query).sort({ eventDate: 1 });
};

exports.getUpcomingEvents = async () => {
    // Logic to get events starting soon, e.g., in the next 30 days
    const now = new Date();
    const future = new Date();
    future.setDate(future.getDate() + 30);
    return await Event.find({
        status: "approved",
        eventDate: { $gte: now, $lte: future },
        $or: [
            { startDate: { $exists: false } },
            { startDate: null },
            { startDate: { $lte: now } }
        ]
    }).sort({ eventDate: 1 });
};

exports.getEventById = async (eventId) => {
    const event = await Event.findById(eventId);
    if (!event) throw new ServiceError("Event not found", 404);
    return event;
};

exports.createEvent = async (eventData) => {
    const event = new Event(eventData);
    await event.save();
    return event;
};

exports.deleteEvent = async (eventId) => {
    const event = await Event.findByIdAndDelete(eventId);
    if (!event) throw new ServiceError("Event not found", 404);
    return event;
};

exports.updateEventStatus = async (eventId, status) => {
    const event = await Event.findByIdAndUpdate(eventId, { status }, { new: true }).populate("seller", "name email");
    if (!event) throw new ServiceError("Event not found", 404);

    if (status === "approved") {
        try {
            await mailtemplate.eventApprovedMail(event.seller.name, event.seller.email, event);
        } catch (err) {
            console.error("Failed to send approval mail:", err);
            // We don't necessarily want to fail the whole status update if the mail fails, 
            // but we should log it.
        }
    } else if (status === "rejected") {
        try {
            // Notify seller
            await mailtemplate.eventRejectedMail(event.seller.name, event.seller.email, event.title);

            // Notify all buyers
            const tickets = await Ticket.find({ eventId, status: "active" }).populate("userId", "name email");
            for (const ticket of tickets) {
                if (ticket.userId && ticket.userId.email) {
                    await mailtemplate.eventCancelledBuyerMail(ticket.userId.name, ticket.userId.email, event.title);
                }
            }
        } catch (err) {
            console.error("Failed to send cancellation mails:", err);
        }
    }

    return event;
};

exports.updateEvent = async (eventId, eventData) => {
    const event = await Event.findByIdAndUpdate(eventId, eventData, { new: true });
    if (!event) throw new ServiceError("Event not found", 404);
    return event;
};
