// backend/src/services/schedule.service.js

const { SCHEDULE_TYPE } = require("../utils/constants");
const { asDateOnly } = require("../utils/time");

const isWithinRange = (operationDate, startDate, endDate) => {
  const op = asDateOnly(operationDate);
  const start = asDateOnly(startDate);
  const end = endDate ? asDateOnly(endDate) : null;

  if (op < start) return false;
  if (end && op > end) return false;
  return true;
};

/**
 * slot fields used:
 * - scheduleType: DAILY | WEEKLY_DAYS | ONCE
 * - operatingDays: [0..6] (only for WEEKLY_DAYS)
 * - startDate, endDate
 */
exports.isOperationDateValidForSlot = (slot, operationDate) => {
  if (!slot) throw new Error("slot is required");

  const opDate = asDateOnly(operationDate);

  // must be inside effective range

  //   if (!isWithinRange(opDate, slot.startDate, slot.endDate)) return false;

  if (slot.scheduleType === SCHEDULE_TYPE.DAILY) {
    return true;
  }

  if (slot.scheduleType === SCHEDULE_TYPE.WEEKLY_DAYS) {
    const weekday = opDate.getDay(); // 0=Sun ... 6=Sat
    const days = Array.isArray(slot.operatingDays) ? slot.operatingDays : [];
    return days.includes(weekday);
  }

  if (slot.scheduleType === SCHEDULE_TYPE.ONCE) {
    // ONCE means startDate == the only allowed day (or start/end equal)
    const allowed = asDateOnly(slot.startDate);
    console.log(allowed);
    return opDate.getTime() === allowed.getTime();
  }

  // unknown schedule type
  return false;
};
