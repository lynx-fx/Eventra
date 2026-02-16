const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    category: { type: String },
    location: { type: String, required: true },
    price: { type: Number, default: 0 },
    capacity: {
      premium: { type: Number, default: 0 },
      standard: { type: Number, default: 0 },
      economy: { type: Number, default: 0 },
    },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    eventDate: { type: Date, required: true },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending"
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Event", eventSchema);
