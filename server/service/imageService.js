const Image = require("../model/Images.js");
const Report = require("../model/Reports.js");

exports.getGalleryImages = async (eventId) => {
    const query = eventId && eventId !== 'all' ? { eventRoomId: eventId } : {};
    // Fetch latest images for gallery
    return await Image.find(query).sort({ uploadedDate: -1 }).populate('userId', 'name').limit(50);
};

exports.saveImage = async (imageData) => {
    const image = new Image(imageData);
    await image.save();
    return image;
};

exports.reportImage = async (reportData) => {
    const report = new Report(reportData);
    await report.save();
    return report;
};
