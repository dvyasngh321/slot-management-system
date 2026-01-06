// backend/src/services/counterWindow.service.js

const { COUNTER_RULES } = require("../utils/constants.js");
const { hhmmToMinutes, minutesToHHmm, parseHHmm } = require("../utils/time.js");

/**
 * Computes counter opening window based on your rules:
 * - endTime = departureDateTime - 60 min (close 1 hour before departure)
 * - startTime = endTime - 120 min (narrow) OR -180 min (wide)
 *
 * Returns:
 * { departureDateTime, startTime, endTime, countersRequired }
 */
exports.computeCounterWindow = ({ departureTime, aircraftType }) => {
  console.log(aircraftType);
  const rule = COUNTER_RULES[aircraftType];
  if (!rule)
    throw new Error("Invalid aircraftType. Use NARROWBODY or WIDEBODY");

  const depMin = hhmmToMinutes(departureTime);

  const endMin = depMin - rule.closeBeforeDepartureMin;
  const startMin = endMin - rule.openDurationMinutes;

  const startTime = minutesToHHmm(startMin);
  const endTime = minutesToHHmm(endMin);

  return {
    startTime,
    endTime,
    countersRequired: rule.countersRequired,
  };
};
