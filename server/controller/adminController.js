const adminService = require("../service/adminService");

exports.getAnalytics = async (req, res) => {
    try {
        const analytics = await adminService.getAnalytics();
        res.status(200).json({
            success: true,
            analytics
        });
    } catch (err) {
        console.error(err);
        if (err.status) {
            return res.status(err.status).json({ success: false, message: err.message });
        }
        res.status(500).json({ success: false, message: "Error fetching analytics" });
    }
};

exports.addAdmin = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const result = await adminService.addAdmin(name, email, password);
        res.status(201).json({
            success: true,
            message: "New admin added successfully",
        });
    } catch (err) {
        console.error(err);
        if (err.status) {
            return res.status(err.status).json({ success: false, message: err.message });
        }
        res.status(500).json({ success: false, message: "Error adding admin" });
    }
};

exports.getAllUsers = async (req, res) => {
    try {
        const users = await adminService.getAllUsers();
        res.status(200).json({ success: true, users });
    } catch (err) {
        console.error(err);
        if (err.status) {
            return res.status(err.status).json({ success: false, message: err.message });
        }

        res.status(500).json({ success: false, message: "Error fetching users" });
    }
};

exports.getAllReports = async (req, res) => {
    try {
        const reports = await adminService.getAllReports();
        res.status(200).json({ success: true, reports });
    } catch (err) {
        console.error(err);
        if (err.status) {
            return res.status(err.status).json({ success: false, message: err.message });
        }
        res.status(500).json({ success: false, message: "Error fetching reports" });
    }
};

exports.resolveReport = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const report = await adminService.resolveReport(id, status);
        res.status(200).json({ success: true, message: `Report marked as ${status || "reviewed"}`, report });
    } catch (err) {
        console.error(err);
        if (err.status) {
            return res.status(err.status).json({ success: false, message: err.message });
        }
        res.status(500).json({ success: false, message: "Error updating report status" });
    }
};

exports.banUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { user, isActive } = await adminService.banUser(id);
        res.status(200).json({
            success: true,
            message: `User ${isActive ? "activated" : "banned"} successfully`,
            isActive,
        });
    } catch (err) {
        console.error(err);
        if (err.status) {
            return res.status(err.status).json({ success: false, message: err.message });
        }
        res.status(500).json({ success: false, message: "Error updating user status" });
    }
};

exports.removeImage = async (req, res) => {
    try {
        const { id } = req.params;
        const { isActive } = req.body;
        const { image, isActive: newIsActive } = await adminService.removeImage(id, isActive);
        res.status(200).json({
            success: true,
            message: `Image ${newIsActive ? "restored" : "removed"} successfully`,
            isActive: newIsActive,
        });
    } catch (err) {
        console.error(err);
        if (err.status) {
            return res.status(err.status).json({ success: false, message: err.message });
        }
        res.status(500).json({ success: false, message: "Error updating image status" });
    }
};

exports.getUserReportHistory = async (req, res) => {
    try {
        const { userId } = req.params;
        const history = await adminService.getUserReportHistory(userId);
        res.status(200).json({
            success: true,
            history
        });
    } catch (err) {
        console.error(err);
        if (err.status) {
            return res.status(err.status).json({ success: false, message: err.message });
        }
        res.status(500).json({ success: false, message: "Error fetching user history" });
    }
};
