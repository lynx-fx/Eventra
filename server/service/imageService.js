const Image = require("../model/Images.js");
const Report = require("../model/Reports.js");

class ServiceError extends Error {
    constructor(message, status) {
        this.message = message;
        this.status = status;
    }
}

exports.getGalleryImages = async (eventId) => {
    const query = eventId && eventId !== 'all' ? { eventId: eventId, isActive: true } : { isActive: true };
    // Fetch latest images for gallery
    const images =  await Image.find(query).sort({ uploadedDate: -1 }).populate('userId', 'name').limit(50);
    if (!images){
        throw new ServiceError("No images available", 404);
    }
    return images;
    
    
};

exports.saveImage = async (imageData) => {
    const image = new Image(imageData);
    await image.save();
    return image;
};

exports.checkExistingReport = async (userId, imageId) => {
    const image =  await Report.findOne({ reporterId: userId, imageId });
    if (!image){
        throw new ServiceError("No images available", 404);
    }
    return image;
};

exports.reportImage = async (reportData) => {
    const report = new Report(reportData);
    await report.save();
    return report;
};
