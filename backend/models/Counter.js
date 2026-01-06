const mongoose = require("mongoose");
const CounterSchema = new mongoose.Schema(
  {
    side: {
      type: String,
      enum: ["A", "B"],
      required: true,
    },
    counterNos: {
      type: [Number],
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

CounterSchema.index({ side: 1, counterNos: 1 }, { unique: true });

CounterSchema.virtual("counterCode").get(function () {
  return `${this.side}${this.counterNo}`;
});

CounterSchema.set("toJSON", { virtuals: true });
CounterSchema.set("toObject", { virtuals: true });

module.exports = mongoose.model("Counter", CounterSchema);
