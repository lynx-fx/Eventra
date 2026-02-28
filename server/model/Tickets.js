const mongoose = require("mongoose");

const ticketSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },
    ticketType: {
      type: String,
      enum: ["premium", "standard", "economy"],
      required: true,
    },
    seatCount: { type: Number, required: true, default: 1 },
    price: { type: Number, required: true },
    status: {
      type: String,
      enum: ["pending", "active", "used", "cancelled"],
      default: "pending",
    },
    purchaseDate: { type: Date, default: Date.now },
    transaction_uuid: {
      type: String, required: true,
    },
    transaction_code: {
      type: String, required: function (){
        this.status == "active";
      }
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Ticket", ticketSchema);