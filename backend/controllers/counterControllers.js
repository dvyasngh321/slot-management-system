const CounterApplication = require("../models/CounterApplication");
const CounterAllocation = require("../models/CounterAllocation");
const { getWindow } = require("../utils/time");
const SlotRequest = require("../models/SlotRequest");
const { allocateCounters } = require("../services/CounterAllocationServices");
const { countersNeeded } = require("../utils/time");

exports.applyForCounters = async (req, res, next) => {
  try {
    const { slotApprovalId } = req.body;

    const slot = await SlotRequest.findOne({
      _id: slotApprovalId,
    });

    if (!slot)
      return res.status(404).json({ message: "Approved slot not found." });

    // prevent duplicate applications for same slot
    const existing = await CounterApplication.findOne({ slotApprovalId });
    if (existing)
      return res
        .status(409)
        .json({ message: "Counter application already exists for this slot." });

    const app = await CounterApplication.create({
      slotApprovalId,
      user: req.user,
      status: "submitted",
    });

    return res
      .status(201)
      .json({ message: "Counter application submitted.", data: app });
  } catch (err) {
    next(err);
  }
};

exports.getCountersApplication = async (req, res, next) => {
  try {
    const counterApplications = await CounterApplication.find().populate({
      path: "slotApprovalId",
    });

    return res.status(200).json({
      data: counterApplications,
      message: "Applications for counters fetched successfully",
    });
  } catch (err) {
    next(err);
  }
};

exports.sedAllocateCounters = async (req, res, next) => {
  try {
    const { applicationId } = req.params;

    const app = await CounterApplication.findById(applicationId);
    if (!app)
      return res.status(404).json({ message: "Application not found." });
    if (app.status !== "submitted")
      return res
        .status(400)
        .json({ message: "Application not in SUBMITTED state." });

    const slot = await SlotRequest.findById(app.slotApprovalId);
    if (!slot || slot.status !== "ho_approved") {
      return res.status(400).json({ message: "Slot is not approved." });
    }

    const { openTime, closeTime } = getWindow(
      slot.departureTime,
      slot.aircraftType
    );

    // Try auto-allocation
    const result = await allocateCounters({
      preferredSide: app.preferredSide,
      startTime: openTime,
      endTime: closeTime,
      aircraftType: slot.aircraftType,
    });

    if (!result) {
      return res.status(409).json({
        message: "Not enough free counters for the requested time window.",
        window: { start: openTime, end: closeTime },
      });
    }

    const allocation = await CounterAllocation.create({
      applicationId: app._id,
      slotApprovalId: slot._id,
      airlineId: app.airlineId,
      side: result.side,
      counters: result.counters.map((c) => c._id),
      startTime: openTime,
      endTime: closeTime,
      aircraftType: slot.aircraftType,
    });

    app.status = "allocated";
    await app.save();

    return res.status(201).json({
      message: "Counters allocated successfully.",
      data: allocation,
    });
  } catch (err) {
    next(err);
  }
};

exports.getMyAllocations = async (req, res, next) => {
  try {
    const airlineId = req.user._id;

    const allocations = await CounterAllocation.find({ airlineId })
      .populate("counters", "side number")
      .sort({ startTime: -1 });

    return res.json({ data: allocations });
  } catch (err) {
    next(err);
  }
};
