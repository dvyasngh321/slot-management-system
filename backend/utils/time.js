// backend/src/utils/dateTime.util.js
// Works with Nepal timezone if your server runs in that timezone.
// (Later we can add luxon for strict timezone control.)

const parseHHmm = (timeStr) => {
  // "11:30" -> { hh: 11, mm: 30 }
  if (!/^\d{2}:\d{2}$/.test(timeStr)) {
    throw new Error("Invalid time format. Use 'HH:mm' like '11:30'");
  }
  const [hh, mm] = timeStr.split(":").map(Number);
  if (hh < 0 || hh > 23 || mm < 0 || mm > 59) {
    throw new Error("Invalid time value in HH:mm");
  }
  return { hh, mm };
};

const asDateOnly = (dateInput) => {
  // returns Date at 00:00:00 local time
  const d = new Date(dateInput).getTime();

  if (Number.isNaN(d)) throw new Error("Invalid date");
  const date = new Date(d);

  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    0,
    0,
    0,
    0
  );
};

const combineDateAndTime = (hhmm) => {
  // operationDate: Date (date-only or any date), hhmm: "11:30"
  const dateOnly = asDateOnly(hhmm);

  const { hh, mm } = parseHHmm(hhmm);
  return new Date(
    dateOnly.getFullYear(),
    dateOnly.getMonth(),
    dateOnly.getDate(),
    hh,
    mm,
    0,
    0
  );
};

exports.addMinutes = (dateObj, minutes) => {
  return new Date(dateObj.getTime() + minutes * 60 * 1000);
};

const hhmmToMinutes = (timeStr) => {
  const { hh, mm } = parseHHmm(timeStr);
  return hh * 60 + mm;
};

const minutesToHHmm = (totalMinutes) => {
  // normalize into 0..1439
  let m = totalMinutes % (24 * 60);
  if (m < 0) m += 24 * 60;

  const hh = Math.floor(m / 60);
  const mm = m % 60;
  return `${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}`;
};

const timeOverlapHHmm = (startA, endA, startB, endB) => {
  // overlap rule: startA < endB && endA > startB (minutes)
  const a1 = hhmmToMinutes(startA);
  const a2 = hhmmToMinutes(endA);
  const b1 = hhmmToMinutes(startB);
  const b2 = hhmmToMinutes(endB);

  // NOTE: This assumes windows do NOT cross midnight (true for your use case).
  return a1 < b2 && a2 > b1;
};

const dateRangesOverlap = (aFrom, aTo, bFrom, bTo) => {
  const A1 = new Date(aFrom);
  const A2 = new Date(aTo);
  const B1 = new Date(bFrom);
  const B2 = new Date(bTo);

  if ([A1, A2, B1, B2].some((d) => Number.isNaN(d.getTime()))) {
    throw new Error("Invalid date in dateRangesOverlap");
  }

  // overlap rule: A1 <= B2 && A2 >= B1
  return A1 <= B2 && A2 >= B1;
};

const daysOverlap = (daysA = [], daysB = []) => {
  const setA = new Set(daysA);
  return (daysB || []).some((d) => setA.has(d));
};

module.exports = {
  asDateOnly,
  combineDateAndTime,
  hhmmToMinutes,
  minutesToHHmm,
};
