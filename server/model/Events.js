const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    category: { type: String, required: true, enum: ["Music", "Sports", "Theatre", "Festival", "Concert", "Workshop", "Other"] },
    location: { type: String, required: true }, // TODO: udpate it to city
    venue: { type: String, required: true },
    price: {
      premium: { type: Number, default: 0 },
      standard: { type: Number, default: 0 },
      economy: { type: Number, default: 0 },
    },
    capacity: {
      premium: { type: Number, default: 0 },
      standard: { type: Number, default: 0 },
      economy: { type: Number, default: 0 },
    },
    soldTickets: {
      premium: { type: Number, default: 0 },
      standard: { type: Number, default: 0 },
      economy: { type: Number, default: 0 },
    },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    eventDate: { type: Date, required: true },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "ended"],
      default: "pending"
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    bannerImage: {
      type: String,
      default: "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=2070&auto=format&fit=crop"
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Event", eventSchema);
