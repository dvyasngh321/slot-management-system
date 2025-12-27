const express = require("express");
const { protect, authorizeRoles } = require("../middleware/authMiddleware");

const {
  createSlot,
  getSubmittedSLotData,
  getApprovedSlotData,
  getRejectedSlotData,
  getAllApprovedSlot,
  charteredFlights,
} = require("../controllers/slotController");

const router = express.Router();

router.post("/apply-for-slot", protect, authorizeRoles("airlines"), createSlot);
router.get(
  "/slot/pending",
  protect,
  authorizeRoles("airlines"),
  getSubmittedSLotData
);
router.get(
  "/slot/approved",
  protect,
  authorizeRoles("airlines"),
  getApprovedSlotData
);
router.get(
  "/slot/approved",
  protect,
  authorizeRoles("airlines"),
  getRejectedSlotData
);

router.get(
  "/slot/chartered",
  protect,
  authorizeRoles("airlines"),
  charteredFlights
);
router.get("/approved/slots", protect, getAllApprovedSlot);
module.exports = router;
