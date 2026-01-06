const { hhmmToMinutes } = require("../utils/time");
const { buildHourlyBuckets } = require("../utils/hourBucket");

/**
 * flights = [
 *   { arrivalTime: "01:20", departureTime: "02:40" }
 * ]
 */
const calculateHourlyCongestion = (flights) => {
  const buckets = buildHourlyBuckets();

  for (const flight of flights) {
    // Arrival
    if (flight.requestedArrivalTime) {
      const min = hhmmToMinutes(flight.requestedArrivalTime);
      const hour = Math.floor(min / 60);
      buckets[hour].arrivals += 1;
    }

    // Departure
    if (flight.requestedDepartureTime) {
      const min = hhmmToMinutes(flight.requestedDepartureTime);
      const hour = Math.floor(min / 60);
      buckets[hour].departures += 1;
    }
  }

  return buckets.map((b) => ({
    hour: b.label,
    arrivals: b.arrivals,
    departures: b.departures,
    totalMovements: b.arrivals + b.departures,
  }));
};

module.exports = { calculateHourlyCongestion };
