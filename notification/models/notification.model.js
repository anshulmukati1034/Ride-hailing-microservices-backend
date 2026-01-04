const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    ride: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },

    user: {
      type: mongoose.Schema.Types.ObjectId
    },

    captain: {
      type: mongoose.Schema.Types.ObjectId
    },

    event: {
      type: String,
      enum: ["requested", "accepted", "started", "completed"],
      required: true
    },

    channel: {
      type: String,
      enum: ["push", "sms", "email"],
      default: "push"
    },

    status: {
      type: String,
      enum: ["pending", "sent", "failed"],
      default: "pending"
    },

    retryCount: {
      type: Number,
      default: 0
    },

    errorMessage: String
  },
  { timestamps: true }
);

module.exports = mongoose.model("notification", notificationSchema);
