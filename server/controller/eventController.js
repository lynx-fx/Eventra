const { tokenExtractor } = require("../util/tokenExtractor.js");
const jwt = require("jsonwebtoken");
const eventService = require("../service/eventService.js");

exports.getAllEvents = async (req, res) => {
    try {
        const token = tokenExtractor(req);
        let query = {};

        if (token) {
            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                if (decoded.role === "seller") {
                    query = { seller: decoded.id };
                } else if (decoded.role === "admin") {
                    query = {};
                } else {
                    query = { status: "approved" };
                }
            } catch (e) {
                query = { status: "approved" };
            }
        } else if (req.user) {
            // If already authenticated by middleware
            if (req.user.role === "seller") {
                query = { seller: req.user.id };
            } else if (req.user.role === "admin") {
                query = {};
            } else {
                query = { status: "approved" };
            }
        } else {
            query = { status: "approved" };
        }

        const events = await eventService.getEventsByQuery(query);
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
        // req.user is set by protect middleware
        const userId = req.user.id;
        const event = await eventService.createEvent({ ...req.body, seller: userId });
        res.status(201).json({ success: true, event });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
}

exports.deleteEvent = async (req, res) => {
    try {
        await eventService.deleteEvent(req.params.id);
        res.status(200).json({ success: true, message: "Event deleted" });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
}

exports.updateEventStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const event = await eventService.updateEventStatus(req.params.id, status);
        res.status(200).json({ success: true, event });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
}

