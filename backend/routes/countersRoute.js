const { Router } = require("express");
const {
  checkAvailability,
  getAssignedCounters,
  findAvailableCountersByDeparture,
} = require("../controllers/counterAllocation");
const {
  applyForCounters,

  getMyAllocations,
  getCountersApplication,
} = require("../controllers/counterControllers.js");

const { protect, authorizeRoles } = require("../middleware/authMiddleware");

const router = Router();

router.get("/assigned-counters", protect, getAssignedCounters);
// AIRLINE
router.post("/apply", protect, authorizeRoles("airlines"), applyForCounters);
router.post(
  "/find-available-counters",
  protect,
  authorizeRoles("sed"),
  findAvailableCountersByDeparture
);
// router.get(
//   "/my-allocations",
//   protect,
//   authorizeRoles("airlines"),
//   getMyAllocations
// );

// SED

router.post(
  "/check-availability",
  protect,
  authorizeRoles("sed"),
  checkAvailability
);
router.get(
  "/application",
  protect,
  authorizeRoles("sed", "airlines"),
  getCountersApplication
);

module.exports = router;
