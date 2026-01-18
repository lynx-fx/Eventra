const eventService = require("../service/eventService.js");

exports.getAllEvents = async (req, res) => {
    try {
        const events = await eventService.getAllEvents();
        res.status(200).json({ success: true, events });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.getUpcoming = async (req, res) => {
    try {
        const events = await eventService.getUpcomingEvents();
        res.status(200).json({ success: true, events });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
}

exports.getEventById = async (req, res) => {
    try {
        const event = await eventService.getEventById(req.params.id);
        if (!event) {
            return res.status(404).json({ success: false, message: "Event not found" });
        }
        res.status(200).json({ success: true, event });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.createEvent = async (req, res) => {
    try {
        const event = await eventService.createEvent(req.body);
        res.status(201).json({ success: true, event });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
}
