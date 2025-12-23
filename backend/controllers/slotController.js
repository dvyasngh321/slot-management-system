const mongoose = require("mongoose");
const SlotRequest = require("../models/SlotRequest");

const canEdit = (status) =>
  status === "submitted" || status === "fp_needs_change";

exports.createSlot = async (req, res) => {
  try {
    const {
      flightNumber,
      flightType,
      sector,
      origin,
      destination,
      aircraftType,
      requestedArrivalTime,
      requestedDepartureTime,
    } = req.body;
    if (!flightNumber || !sector || !aircraftType) {
      return res.status(400).json({
        message: "Missing required fields",
      });
    }
    if (!requestedArrivalTime && !requestedDepartureTime) {
      return res.status(400).json({
        message: "Provide Requested Arrival and Departure Time",
      });
    }
    const slot = await SlotRequest.create({
      airlineId: req.user.airlinesName,
      createdBy: req.user._id,
      flightNumber,
      flightType,
      sector,
      origin,
      destination,
      aircraftType,
      requestedArrivalTime: requestedArrivalTime
        ? new Date(requestedArrivalTime)
        : null,
      requestedDepartureTime: requestedDepartureTime
        ? new Date(requestedDepartureTime)
        : null,
      status: "submitted",
    });
    console.log(slot);
    return res.status(201).json({
      message: "Slot Request submitted.",
      data: slot,
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};
