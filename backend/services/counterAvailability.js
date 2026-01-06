/**
 * Finds contiguous available counters on a side
 */

const TOTAL_COUNTERS = {
  A: 13,
  B: 21,
};

exports.getAvailableCounters = (side, occupiedSet) => {
  const max = TOTAL_COUNTERS[side];
  if (!max) throw new Error(`Invalid Counter side :${side}`);

  const available = [];
  for (let i = 1; i <= max; i++) {
    if (!occupiedSet.has(i)) {
      available.push(i);
    }
  }
  return available;
};
