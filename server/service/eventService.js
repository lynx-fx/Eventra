const Event = require("../model/Events.js");

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
    const event = await Event.findByIdAndUpdate(eventId, { status }, { new: true });
    if (!event) throw new ServiceError("Event not found", 404);
    return event;
};

exports.updateEvent = async (eventId, eventData) => {
    const event = await Event.findByIdAndUpdate(eventId, eventData, { new: true });
    if (!event) throw new ServiceError("Event not found", 404);
    return event;
};
