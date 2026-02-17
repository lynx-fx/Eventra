const mongoose = require("mongoose");
const Report = require("../model/Reports");
const User = require("../model/Users");
const Image = require("../model/Images");
const EventRoom = require("../model/EventRooms");
const Event = require("../model/Events");

exports.getAllReports = async (req, res) => {
    try {
        const reports = await Report.find()
            .populate("reporterId", "name email profileUrl")
            .populate({
                path: "imageId",
                populate: [
                    { path: "userId", select: "name email profileUrl isActive" },
                    {
                        path: "eventRoomId",
                        populate: {
                            path: "eventId",
                            select: "name location date",
                        },
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
