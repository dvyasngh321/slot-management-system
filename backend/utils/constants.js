const AIRCRAFT = {
  NARROWBODY: "NARROWBODY",
  WIDEBODY: "WIDEBODY",
};

const COUNTER_RULES = {
  [AIRCRAFT.NARROWBODY]: {
    countersRequired: 3,
    openDurationMinutes: 120,
    closeBeforeDepartureMin: 60,
  },
  [AIRCRAFT.WIDEBODY]: {
    countersRequired: 4,
    openDurationMinutes: 150,
    closeBeforeDepartureMin: 60,
  },
};

const SCHEDULE_TYPE = {
  DAILY: "DAILY",
  WEEKLY_DAYS: "WEEKLY_DAYS",
  ONCE: "ONCE",
};

module.exports = { AIRCRAFT, COUNTER_RULES, SCHEDULE_TYPE };
