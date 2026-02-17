const imageService = require("../service/imageService.js");

exports.getGallery = async (req, res) => {
    try {
        const { eventId } = req.query;
        const images = await imageService.getGalleryImages(eventId);
        res.status(200).json({ success: true, images });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.uploadImage = async (req, res) => {
    try {
        const { eventRoomId } = req.body;
        const userId = req.user.id;

        if (!req.file) {
            return res.status(400).json({ success: false, message: "No image file provided" });
        }

        const imageUrl = `/images/${req.file.filename}`;
        const imageData = {
            imageUrl,
            userId,
            eventRoomId
        };

        let image = await imageService.saveImage(imageData);
        image = await image.populate('userId', 'name');
        res.status(201).json({ success: true, image });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
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
        res.status(500).json({ success: false, message: err.message });
    }
};
