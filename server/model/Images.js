const mongoose = require("mongoose");

const imageSchema = new mongoose.Schema(
  {
    imageUrl: { type: String, required: true },
    uploadedDate: { type: Date, default: Date.now },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    eventRoomId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "EventRoom",
    },
    isActive: {
      type: Boolean,
      default: false,
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Image", imageSchema);
