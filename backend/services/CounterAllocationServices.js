const Counter = require("../models/Counter");
const { countersNeeded } = require("../utils/time");

exports.findBusyCounterIds = async ({ side, startTime, endTime }) => {
  // allocations that overlap requested window
  const overlapping = await Counter.find({
    side,
    startTime: { $lt: endTime },
    endTime: { $gt: startTime },
  }).select("counters");

  const busy = new Set();
  for (const alloc of overlapping) {
    for (const c of alloc.counters) busy.add(String(c));
  }
  return busy;
};

exports.pickFreeCounters = async ({ side, startTime, endTime, needed }) => {
  const busyIds = await findBusyCounterIds({ side, startTime, endTime });

  const allCounters = await Counter.find({ side, isActive: true }).sort({
    number: 1,
  });
  const free = allCounters.filter((c) => !busyIds.has(String(c._id)));

  if (free.length < needed) return null;
  return free.slice(0, needed); // simplest strategy: take first available
};

exports.allocateCounters = async ({
  preferredSide, // "A" | "B" | "ANY"
  startTime,
  endTime,
  aircraftType,
}) => {
  const needed = countersNeeded(aircraftType);

  const sidesToTry = preferredSide === "ANY" ? ["A", "B"] : [preferredSide];

  for (const side of sidesToTry) {
    const picked = await pickFreeCounters({ side, startTime, endTime, needed });
    if (picked) return { side, counters: picked };
  }

  return null; // not enough free counters
};
