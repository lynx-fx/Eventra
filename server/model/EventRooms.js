const mongoose = require("mongoose");

const eventRoomSchema = new mongoose.Schema(
  {
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },
    accessDetails: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("EventRoom", eventRoomSchema);
