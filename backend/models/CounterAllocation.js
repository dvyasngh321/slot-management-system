const mongoose = require("mongoose");

const counterAllocationSchema = new mongoose.Schema(
  {
    counterApplicationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CounterApplication",
      required: true,
    },
    slotId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SlotRequest",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    counterSide: {
      type: String,
      enum: ["A", "B"],
      required: true,
    },
    counterNos: {
      type: [Number],
      required: true,
    },
    startTime: {
      type: String,
      required: true,
    },
    endTime: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "cancelled"],
      default: "active",
    },

    cancelledAt: {
      type: Date,
    },
    cancelReason: {
      type: String,
    },
  },
  { timestamps: true }
);

counterAllocationSchema.index({
  counterSide: 1,
  counterNo: 1,
  startTime: 1,
  endTime: 1,
  status: 1,
});

module.exports = new mongoose.model(
  "CounterAllocation",
  counterAllocationSchema
);
