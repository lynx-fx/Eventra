const imageService = require("../service/imageService.js");
const Event = require("../model/Events.js");

exports.getGallery = async (req, res) => {
    try {
        const { eventId } = req.query;
        const images = await imageService.getGalleryImages(eventId);
        res.status(200).json({ success: true, images });
    } catch (err) {
        res.status(err.status || 500).json({ success: false, message: err.message });
    }
};

exports.uploadImages = async (req, res) => {
    try {
        const { eventId } = req.body;
        const userId = req.user.id;

        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ success: false, message: "No image files provided" });
        }

        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({ success: false, message: "Event not found" });
        }

        const now = new Date();
        const eventDate = new Date(event.eventDate);
        const eventEndDate = new Date(event.eventDate);
        eventEndDate.setDate(eventEndDate.getDate() + 3);

        if (now < eventDate) {
            return res.status(403).json({ success: false, message: "Cannot post before event start time" });
        }
        if (now > eventEndDate) {
            return res.status(403).json({ success: false, message: "Event room is closed to new posts (3 days passed)" });
        }

        const uploadPromises = req.files.map(async (file) => {
            const imageUrl = `/images/${file.filename}`;
            const imageData = {
                imageUrl,
                userId,
                eventId
            };

            let image = await imageService.saveImage(imageData);
            return await image.populate('userId', 'name');
        });

        const images = await Promise.all(uploadPromises);
        res.status(201).json({ success: true, images });
    } catch (err) {
        res.status(err.status || 500).json({ success: false, message: err.message });
    }
};

exports.reportImage = async (req, res) => {
    try {
        const { imageId, reportReason } = req.body;
        const userId = req.user.id;

        const reportData = {
            imageId,
            reportType: "Image",
            reportReason,
            reporterId: userId
        };

        const existingReport = await imageService.checkExistingReport(userId, imageId);
        if (existingReport) {
            return res.status(400).json({ success: false, message: "You have already reported this image." });
        }

        const report = await imageService.reportImage(reportData);
        res.status(201).json({ success: true, report });
    } catch (err) {
        console.log(err.message);
        res.status(err.status || 500).json({ success: false, message: err.message });
    }
};
