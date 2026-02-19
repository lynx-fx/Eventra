const mongoose = require("mongoose");
const Report = require("../model/Reports");
const User = require("../model/Users");
const Image = require("../model/Images");
const EventRoom = require("../model/EventRooms");
const Event = require("../model/Events");

const Ticket = require("../model/Tickets");
const userService = require("../service/userService");

exports.getAnalytics = async (req, res) => {
    try {
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

        res.status(200).json({
            success: true,
            analytics: {
                totalEvents,
                pendingEvents,
                approvedEvents,
                totalUsers,
                activeUsers,
                totalRevenue: totalRev
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Error fetching analytics" });
    }
};

exports.addAdmin = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Basic validation
        if (!name || !email || !password) {
            return res.status(400).json({ success: false, message: "Please provide all required fields" });
        }

        // Create user with admin role
        const result = await userService.signup(name, email, password, "admin");

        res.status(201).json({
            success: true,
            message: "New admin added successfully",
        });
    } catch (err) {
        console.error(err);
        if (err.message.includes("already exists")) {
            return res.status(400).json({ success: false, message: err.message });
        }
        res.status(500).json({ success: false, message: "Error adding admin" });
    }
};

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, users });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Error fetching users" });
    }
};

exports.getAllReports = async (req, res) => {
    try {
        const reports = await Report.find()
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

        res.status(200).json({ success: true, reports });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Error fetching reports" });
    }
};

exports.resolveReport = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const report = await Report.findByIdAndUpdate(
            id,
            { reportStatus: status || "reviewed" },
            { new: true }
        );

        if (!report) {
            return res.status(404).json({ success: false, message: "Report not found" });
        }

        res.status(200).json({ success: true, message: `Report marked as ${status || "reviewed"}`, report });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Error updating report status" });
    }
};

exports.banUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        if (user.role === "admin") {
            return res.status(403).json({ success: false, message: "Cannot ban admin accounts" });
        }

        user.isActive = !user.isActive;
        await user.save();

        res.status(200).json({
            success: true,
            message: `User ${user.isActive ? "activated" : "banned"} successfully`,
            isActive: user.isActive,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Error updating user status" });
    }
};

exports.removeImage = async (req, res) => {
    try {
        const { id } = req.params;
        const { isActive } = req.body;

        const image = await Image.findById(id);

        if (!image) {
            return res.status(404).json({ success: false, message: "Image not found" });
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

        res.status(200).json({
            success: true,
            message: `Image ${isActive ? "restored" : "removed"} successfully`,
            isActive: image.isActive,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Error updupating image status" });
    }
};

exports.getUserReportHistory = async (req, res) => {
    try {
        const { userId } = req.params;

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
        // Since we can't easily query deep populate, we fetch all reports and filter or use aggregate.
        // For simplicity and assuming low volume, we can use aggregate lookup.

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

        res.status(200).json({
            success: true,
            history: {
                reportsMade,
                reportsAgainst
            }
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Error fetching user history" });
    }
};
