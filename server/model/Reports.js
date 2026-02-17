const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema(
  {
    reportType: { type: String, required: true },
    reportReason: { type: String, required: true },
    reportedDate: { type: Date, default: Date.now },
    reportStatus: {type: String, default: "pending", enum: ["pending", "banned", "reviewed"]},
    reporterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    imageId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Image",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Report", reportSchema);
