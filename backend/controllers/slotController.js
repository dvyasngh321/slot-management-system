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
      startDate,
      scheduleType,
      operatingDays,
      endDate,
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
      requestedArrivalTime,
      requestedDepartureTime,
      endDate,
      startDate,
      status: "submitted",
      scheduleType,
      operatingDays,
      createdBy: req.user,
    });

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

exports.pendingRecommendationSlotData = async (req, res) => {
  try {
    const pendingRecommendation = await SlotRequest.find({
      status: "submitted",
    }).populate("airlineId", "airlineName");

    return res.status(200).json({
      data: pendingRecommendation,
      message: "Data pending for Recommendation",
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};

exports.pendingApprovalSlotData = async (req, res) => {
  try {
    const approvalRecommendation = await SlotRequest.find({
      status: "fp_recommended",
    }).populate("airlineId", "airlineName");

    return res.status(201).json({
      data: approvalRecommendation,
      message: "Data pending for Head Office Approval",
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};

exports.flightPermissionRecommendedTime = async (req, res, next) => {
  try {
    const { slotId, recommendedArrivalTime, recommendedDepartureTime, note } =
      req.body;
    const fp_user = req.user._id;

    const slot = await SlotRequest.findById(slotId);
    if (!slot) {
      return res.status(404).json({ message: "Slot request not found" });
    }

    // status guard
    if (slot.status !== "submitted") {
      return res.status(400).json({
        message: "Slot request is not in submitted state",
      });
    }

    await SlotRequest.findByIdAndUpdate(slot._id, {
      $set: {
        status: "fp_recommended",
        "flightPermission.recommendedArrivalTime": recommendedArrivalTime,
        "flightPermission.recommendedDepartureTime": recommendedDepartureTime,
        "flightPermission.note": note,
        "flightPermission.reviewedBy": fp_user,
        "flightPermission.reviewedAt": new Date(),
      },
    });

    return res.json({ message: "Flight permission recommendation saved" });
  } catch (err) {
    next(err);
  }
};

exports.headOfficeApprovedSchedule = async (req, res) => {
  try {
    const { slotId, decisionNote } = req.body;
    const ho_user = req.user._id;

    const slot = await SlotRequest.findById(slotId);
    if (!slot) {
      return res.status(404).json({ message: "Slot request not found" });
    }

    // status guard
    if (slot.status !== "fp_recommended") {
      return res.status(400).json({
        message: "Slot request is not in submitted state",
      });
    }

    await SlotRequest.findByIdAndUpdate(slot._id, {
      $set: {
        status: "ho_approved",
        "flightPermission.decisionNote": decisionNote,
        "headOffice.decidedBy": ho_user,
      },
    });

    return res.json({ message: "Head Office Approved" });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};

exports.getApprovedSlotData = async (req, res) => {
  try {
    const approvedSlotData = await SlotRequest.find({
      airlineId: req.user.airlinesName,
      status: "ho_approved",
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
