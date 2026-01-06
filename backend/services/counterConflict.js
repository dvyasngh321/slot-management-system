// backend/src/services/counterConflict.service.js

const CounterAllocation = require("../models/CounterAllocation");

/**
 * Overlap rule:
 * newStart < existingEnd AND newEnd > existingStart
 *
 * Checks conflicts for multiple counters on the same side.
 * Returns:
 * {
 *   hasConflict: boolean,
 *   conflictsByCounter: { "A-1": [allocDoc, ...], "A-2": [...] }
 * }
 */
exports.checkCounterConflicts = async ({
  counterSide,
  counterNos,
  startTime,
  endTime,
  excludeApplicationId = null, // useful for reallocation / updates later
}) => {
  if (!counterSide) throw new Error("counterSide is required");
  if (!Array.isArray(counterNos) || counterNos.length === 0)
    throw new Error("counterNos must be a non-empty array");
  if (!startTime || !endTime)
    throw new Error("startTime and endTime are required");

  const query = {
    status: "active",
    counterSide,
    counterNos: { $in: counterNos },
    startTime: { $lt: endTime }, // existing.start < newEnd
    endTime: { $gt: startTime }, // existing.end > newStart
  };

  if (excludeApplicationId) {
    query.counterApplicationId = { $ne: excludeApplicationId };
  }

  const conflicts = await CounterAllocation.find(query)
    .select(
      "counterSide counterNo startTime endTime slotId airlineId counterApplicationId status"
    )
    .lean();

  const conflictsByCounter = {};
  for (const c of conflicts) {
    const key = `${c.counterSide}-${c.counterNos}`;
    if (!conflictsByCounter[key]) conflictsByCounter[key] = [];
    conflictsByCounter[key].push(c);
  }

  return {
    hasConflict: conflicts.length > 0,
    conflictsByCounter,
  };
};
