const { Router } = require("express");
const {
  applyForCounters,
  sedAllocateCounters,
  getMyAllocations,
  getCountersApplication,
} = require("../controllers/counterControllers.js");
const { protect, authorizeRoles } = require("../middleware/authMiddleware");

const router = Router();

// AIRLINE
router.post("/apply", protect, authorizeRoles("airlines"), applyForCounters);
router.get(
  "/my-allocations",
  protect,
  authorizeRoles("airlines"),
  getMyAllocations
);

// SED
router.post(
  "/sed/allocate/:applicationId",
  protect,
  authorizeRoles("sed"),
  sedAllocateCounters
);
router.get(
  "/applications",
  protect,
  authorizeRoles("sed"),
  getCountersApplication
);

module.exports = router;
