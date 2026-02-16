const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    isGoogleAuth: { type: Boolean, default: false },
    password: {
      type: String, required: function () {
        return this.isGoogleAuth ? false : true;
      }
    },
    role: {
      type: String,
      enum: ["user", "admin", "seller"],
      default: "user",
    },
    isActive: { type: Boolean, default: true },
    userLocation: { type: String },
    profileUrl: { type: String },
    bio: { type: String },
    authCode: { type: String }
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
