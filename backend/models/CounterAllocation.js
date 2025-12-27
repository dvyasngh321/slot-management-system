const mongoose = require("mongoose");

const CounterAllocationSchema = new mongoose.Schema(
  {
    applicationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CounterApplication",
      required: true,
    },
    slotApprovalId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SlotRequest",
      required: true,
    },
    airlineId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    side: {
      type: String,
      enum: ["A", "B"],
      required: true,
    },
    counters: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Counter",
        required: true,
      },
    ],
    startTime: {
      type: Date,
      required: true,
    },
    endTime: {
      type: Date,
      required: true,
    },
    aircraftType: {
      type: String,
      enum: ["NarrowBody", "WideBody"],
    },
  },
  { timestamps: true }
);

CounterAllocationSchema.index({ side: 1, startTime: 1, endTime: 1 });
CounterAllocationSchema.index({ counters: 1, startTime: 1, endTime: 1 });

module.exports = mongoose.model("CounterAllocation", CounterAllocationSchema);
