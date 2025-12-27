const mongoose = require("mongoose");

const CounterApplicationSchema = new mongoose.Schema(
  {
    slotApprovalId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SlotRequest",
      required: true,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["submitted", "allocated"],
      default: "submitted",
    },
    notes: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("CounterApplication", CounterApplicationSchema);
