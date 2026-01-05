const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    rideId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      index: true
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },

    amount: {
      type: Number,
      required: true
    },

    status: {
      type: String,
      enum: ["pending", "success", "failed"],
      default: "pending"
    },

    provider: {
      type: String,
      default: "mock-gateway"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("payment", paymentSchema);
