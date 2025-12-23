const mongoose = require("mongoose");

const airlineSchema = mongoose.Schema(
  {
    airlineName: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Airline", airlineSchema);
