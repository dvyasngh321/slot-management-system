const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: [
        "head_office",
        "sed",
        "flight_permission",
        "tdo",
        "admin",
        "airlines",
      ],
    },
    airlinesName: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Airline",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
