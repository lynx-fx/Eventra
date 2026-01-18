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
