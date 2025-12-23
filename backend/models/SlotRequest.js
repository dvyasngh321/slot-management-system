const mongoose = require("mongoose");

const slotRequestSchema = new mongoose.Schema(
  {
    airlineId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Airline",
      required: true,
    },
    flightNumber: {
      type: String,
      required: true,
      trim: true,
    },
    flightType: {
      type: String,
      enum: ["scheduled", "charter"],
      default: "scheduled",
    },
    sector: {
      type: String,
      enum: ["international", "domestic"],
      default: "international",
    },
    origin: {
      type: String,
      trim: true,
    },
    destination: {
      type: String,
      trim: true,
    },
    aircraftType: {
      type: String,
      trim: true,
    },
    requestedArrivalTime: { type: Date },
    requestedDepartureTime: { type: Date },
    status: {
      type: String,
      enum: [
        "submitted",
        "fp_recommended",
        "fp_needs_chnange",
        "fp_rejected",
        "ho_approved",
        "ho_rejected",
        "cancelled",
      ],
      default: "submitted",
    },
    flightPermission: {
      recommendedArrivalTime: Date,
      recommendedDepartureTime: Date,
      note: String,
      reviewedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      reviewedAt: Date,
    },

    headOffice: {
      decisionNote: String,
      decidedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("SlotRequest", slotRequestSchema);
