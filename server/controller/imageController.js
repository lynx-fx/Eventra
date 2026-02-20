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

exports.uploadImages = async (req, res) => {
    try {
        const { eventId } = req.body;
        const userId = req.user.id;

        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ success: false, message: "No image files provided" });
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
