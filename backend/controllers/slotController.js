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
      requestedArrivalTime: new Date(requestedArrivalTime).toISOString(),

      requestedDepartureTime: new Date(requestedDepartureTime).toISOString(),
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

exports.getSubmittedSLotData = async (req, res) => {
  try {
    const pendingSlotApprovals = await SlotRequest.find({
      airlineId: req.user.airlinesName,
      status: "submitted",
    }).populate("airlineId", "airlineName");

    console.log();

    return res.status(200).json(pendingSlotApprovals);
  } catch (err) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

exports.getApprovedSlotData = async (req, res) => {
  try {
    const approvedSlotData = await SlotRequest.find({
      airlineId: req.user.airlinesName,
      status: "approved",
    }).populate("airlineId", "airlineName");

    return res.status(200).json(approvedSlotData);
  } catch (err) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

exports.getRejectedSlotData = async (req, res) => {
  try {
    const rejectedSlotData = await SlotRequest.find({
      airlineId: req.user.airlinesName,
      status: "rejected",
    }).populate("airlineId", "airlineName");

    return res.status(200).json(rejectedSlotData);
  } catch (err) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

exports.getAllApprovedSlot = async (req, res) => {
  try {
    const getAllApprovedSlotData = await SlotRequest.find({
      status: "approved",
    }).populate("airlineId", "airlineName");

    return res.status(200).json({
      data: getAllApprovedSlotData,
      message: "data fetched successfully",
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};

exports.charteredFlights = async (req, res) => {
  try {
    const getCharteredFlights = await SlotRequest.find({
      airlineId: req.user.airlinesName,
      status: "approved",
      flightType: "charter",
    });

    return res.status(200).json({
      data: getCharteredFlights,
      message: "Chartered Flights fetched successfully",
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};
