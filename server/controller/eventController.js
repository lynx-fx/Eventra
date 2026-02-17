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
        const userId = req.user.id;
        const eventData = { ...req.body };

        // Handle File Upload
        if (req.file) {
            // Using path.posix.join or similar to ensure forward slashes for URLs
            eventData.bannerImage = `/images/${req.file.filename}`;
        }

        // Handle parsing of price and capacity if they come as JSON strings from FormData
        if (typeof eventData.price === 'string') {
            try { eventData.price = JSON.parse(eventData.price); } catch (e) { }
        }
        if (typeof eventData.capacity === 'string') {
            try { eventData.capacity = JSON.parse(eventData.capacity); } catch (e) { }
        }

        const event = await eventService.createEvent({ ...eventData, seller: userId });
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


exports.updateEvent = async (req, res) => {
    try {
        const userId = req.user.id;
        const eventData = { ...req.body };

        // Handle File Upload
        if (req.file) {
            // Using path.posix.join or similar to ensure forward slashes for URLs
            eventData.bannerImage = `/images/${req.file.filename}`;
        }

        // Handle parsing of price and capacity if they come as JSON strings from FormData
        if (typeof eventData.price === 'string') {
            try { eventData.price = JSON.parse(eventData.price); } catch (e) { }
        }
        if (typeof eventData.capacity === 'string') {
            try { eventData.capacity = JSON.parse(eventData.capacity); } catch (e) { }
        }

        const event = await eventService.updateEvent(req.params.id, eventData);
        if (!event) {
            return res.status(404).json({ success: false, message: "Event not found" });
        }

        res.status(200).json({ success: true, event });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
}

