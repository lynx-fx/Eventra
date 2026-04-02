const mongoose = require("mongoose");
const Report = require("../model/Reports");
const User = require("../model/Users");
const Image = require("../model/Images");
const EventRoom = require("../model/EventRooms");
const Event = require("../model/Events");
const Ticket = require("../model/Tickets");
const userService = require("../service/userService");

class ServiceError extends Error {
    constructor(message, status) {
        super(message);
        this.status = status;
    }
}

exports.getAnalytics = async () => {
    const totalEvents = await Event.countDocuments();
    const pendingEvents = await Event.countDocuments({ status: "pending" });
    const approvedEvents = await Event.countDocuments({ status: "approved" });

    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ isActive: true });

    const totalRevenue = await Ticket.aggregate([
        { $match: { status: "active" } },
        { $group: { _id: null, total: { $sum: "$price" } } }
    ]);

    const totalRev = totalRevenue.length > 0 ? totalRevenue[0].total : 0;

    return {
        totalEvents,
        pendingEvents,
        approvedEvents,
        activeUsers,
        totalRevenue: totalRev
    };
};

exports.addAdmin = async (name, email, password) => {
    // Basic validation
    if (!name || !email || !password) {
        throw new ServiceError("Please provide all required fields", 400);
    }

    // Create user with admin role
    const result = await userService.signup(name, email, password, "admin");

    return result;
};

exports.getAllUsers = async () => {
    return await User.find().sort({ createdAt: -1 });
};

exports.getAllReports = async () => {
    return await Report.find()
        .populate("reporterId", "name email profileUrl")
        .populate({
            path: "imageId",
            populate: [
                { path: "userId", select: "name email profileUrl isActive" },
                {
                    path: "eventId",
                    select: "title city venue eventDate",
                },
            ],
        })
        .sort({ createdAt: -1 });
};

exports.resolveReport = async (id, status) => {
    const report = await Report.findByIdAndUpdate(
        id,
        { reportStatus: status || "reviewed" },
        { new: true }
    );

    if (!report) {
        throw new ServiceError("Report not found", 404);
    }

    return report;
};

exports.banUser = async (id) => {
    const user = await User.findById(id);
    if (!user) {
        throw new ServiceError("User not found", 404);
    }

    if (user.role === "admin") {
        throw new ServiceError("Cannot ban admin accounts", 403);
    }

    user.isActive = !user.isActive;
    await user.save();

    return { user, isActive: user.isActive };
};

exports.removeImage = async (id, isActive) => {
    const image = await Image.findById(id);

    if (!image) {
        throw new ServiceError("Image not found", 404);
    }

    image.isActive = isActive;
    await image.save();

    if (!isActive) {
        await Report.updateMany(
            { imageId: id, reportStatus: { $in: ["pending", "reviewed"] } },
            { $set: { reportStatus: "removed" } }
        );
    } else {
        await Report.updateMany(
            { imageId: id, reportStatus: "removed" },
            { $set: { reportStatus: "reviewed" } }
        );
    }

    return { image, isActive: image.isActive };
};

exports.getUserReportHistory = async (userId) => {
    // Find reports made by the user
    const reportsMade = await Report.find({ reporterId: userId })
        .populate("reporterId", "name email")
        .populate({
            path: "imageId",
            populate: {
                path: "userId",
                select: "name email"
            }
        });

    // Find reports against the user (where user uploaded the image)
    const reportsAgainst = await Report.aggregate([
        {
            $lookup: {
                from: "images",
                localField: "imageId",
                foreignField: "_id",
                as: "imageId"
            }
        },
        { $unwind: "$imageId" },
        {
            $match: {
                "imageId.userId": new mongoose.Types.ObjectId(userId)
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "reporterId",
                foreignField: "_id",
                as: "reporter"
            }
        },
        { $unwind: "$reporter" }
    ]);

    return {
        reportsMade,
        reportsAgainst
    };
};