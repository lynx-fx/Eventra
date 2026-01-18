const Image = require("../model/Images.js");

exports.getGalleryImages = async (eventId) => {
    const query = eventId && eventId !== 'all' ? { eventRoomId: eventId } : {};
    // Fetch latest images for gallery
    return await Image.find(query).sort({ uploadedDate: -1 }).populate('userId', 'name').limit(20);
};

// Placeholder for upload logic if needed, usually handled by specific upload middleware/service
exports.saveImage = async (imageData) => {
    const image = new Image(imageData);
    await image.save();
    return image;
}
