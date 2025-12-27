exports.getWindow = async (departureTime, aircraftType) => {
  const dep = new Date(departureTime);
  const close = new Date(dep.getTime() - 60 * 60 * 1000);
  const durationHours = aircraftType === "WIDE" ? 2.5 : 2;
  const open = new Date(close.getTime() - durationHours * 60 * 60 * 1000);

  return { openTime: open, closeTime: close, durationHours };
};

exports.countersNeeded = async (aircraftType) => {
  return aircraftType === "WIDE" ? 4 : 3;
};

exports.overlaps = async (aStart, aEnd, bStart, bEnd) => {
  return aStart < bEnd && aEnd > bStart;
};
