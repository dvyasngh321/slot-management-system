const buildHourlyBuckets = () => {
  const buckets = [];

  for (let h = 0; h < 24; h++) {
    const start = String(h).padStart(2, "0") + ":00";
    const end = String(h + 1).padStart(2, "0") + ":00";

    buckets.push({
      hourIndex: h,
      label: `${start}-${end}`,
      arrivals: 0,
      departures: 0,
    });
  }

  return buckets;
};

module.exports = { buildHourlyBuckets };
