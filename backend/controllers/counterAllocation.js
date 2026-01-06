// backend/src/controllers/counterAllocation.controller.js
// Next small controller: CHECK AVAILABILITY (no allocation yet)

const CounterApplication = require("../models/CounterApplication");
const Slot = require("../models/SlotRequest");
const { computeCounterWindow } = require("../services/counterWindow");
const { checkCounterConflicts } = require("../services/counterConflict");
const { validateCountersForSide } = require("../services/counterSelect");
const CounterAllocation = require("../models/CounterAllocation");
const Counter = require("../models/Counter");
const { getAvailableCounters } = require("../services/counterAvailability");

exports.checkAvailability = async (req, res, next) => {
  try {
    const { counterApplicationId, counterSide, counterNos } = req.body;

    const app = await CounterApplication.findById(counterApplicationId).lean();
    if (!app)
      return res.status(404).json({ message: "Counter application not found" });

    const slot = await Slot.findById(app.slotApprovalId).lean();

    if (!slot) return res.status(404).json({ message: "Slot not found" });
    const counterExists = await CounterAllocation.findOne({
      counterApplicationId,
    });
    if (counterExists) {
      return res.status(409).json({
        message: "Counter Allocation already exists for this!",
      });
    }
    validateCountersForSide(counterSide, counterNos);

    // compute window using slot departureTime + slot aircraftType

    const { startTime, endTime, departureDateTime, countersRequired } =
      computeCounterWindow({
        departureTime: slot.flightPermission.recommendedDepartureTime,
        aircraftType: slot.aircraftType,
      });

    // optional: warn if wrong count selected
    if (counterNos.length !== countersRequired) {
      return res.status(400).json({
        message: `Invalid counters count. Required: ${countersRequired}`,
        required: countersRequired,
      });
    }

    const conflictResult = await checkCounterConflicts({
      counterSide,
      counterNos,
      startTime,
      endTime,
      excludeApplicationId: null,
    });

    if (conflictResult?.hasConflict) {
      return res.status(409).json({
        message: "Counter conflict detected",
        details: conflictResult,
      });
    } else {
      const assignedCounters = await CounterAllocation.create({
        counterApplicationId,
        counterSide,
        counterNos,
        startTime,
        endTime,
        slotId: app.slotApprovalId,
        user: req.user,
      });
      const masterCounter = await Counter.create({
        side: counterSide,
        counterNos,
      });

      await CounterApplication.findByIdAndUpdate(counterApplicationId, {
        $set: {
          status: "allocated",
        },
      });

      return res.status(201).json({
        data: assignedCounters,
        conflictResult: conflictResult,
        message: "Counters assigned successfully",
      });
    }
  } catch (err) {
    next(err);
  }
};

exports.findAvailableCountersByDeparture = async (req, res, next) => {
  try {
    const { recommendedDepartureTime, aircraftType } = req.body;

    const { startTime, endTime, countersRequired } = computeCounterWindow({
      departureTime: recommendedDepartureTime,
      aircraftType,
    });

    const overlappingAllocations = await CounterAllocation.find({
      status: "active",
      startTime: { $lt: endTime },
      endTime: { $gt: startTime },
    }).lean();

    const occupied = { A: new Set(), B: new Set() };

    for (const alloc of overlappingAllocations) {
      for (const no of alloc.counterNos) {
        occupied[alloc.counterSide].add(no);
      }
    }

    const availableCounters = {
      A: getAvailableCounters("A", occupied.A),
      B: getAvailableCounters("B", occupied.B),
    };

    return res.json({
      window: { startTime, endTime },
      countersRequired,
      availableCounters,
    });
  } catch (err) {
    next(err);
  }
};

exports.getAssignedCounters = async (req, res) => {
  try {
    const assignedCounters = await CounterAllocation.find().populate({
      path: "slotId",
      populate: {
        path: "airlineId",
        select: "airlineName", // optional
      },
    });

    return res.status(200).json({
      data: assignedCounters,
      message: "Assigned Counters fetched successfully",
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};
