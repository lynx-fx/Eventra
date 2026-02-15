const Event = require("../model/Events.js");

exports.getAllEvents = async () => {
    return await Event.find().sort({ startDate: 1 });
};

exports.getEventsByQuery = async (query) => {
    return await Event.find(query).sort({ startDate: 1 });
};

exports.getUpcomingEvents = async () => {
    // Logic to get events starting soon, e.g., in the next 30 days
    const now = new Date();
    const future = new Date();
    future.setDate(future.getDate() + 30);
    return await Event.find({ startDate: { $gte: now, $lte: future } }).sort({ startDate: 1 });
};

exports.getEventById = async (eventId) => {
    return await Event.findById(eventId);
};

exports.createEvent = async (eventData) => {
    const event = new Event(eventData);
    await event.save();
    return event;
};

exports.deleteEvent = async (eventId) => {
    return await Event.findByIdAndDelete(eventId);
};

exports.updateEventStatus = async (eventId, status) => {
    return await Event.findByIdAndUpdate(eventId, { status }, { new: true });
};
