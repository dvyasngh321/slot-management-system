const express = require("express");
const { protect, authorizeRoles } = require("../middleware/authMiddleware");

const {
  createSlot,
  getSubmittedSLotData,
  getApprovedSlotData,
  getRejectedSlotData,
  getAllApprovedSlot,
  charteredFlights,
  flightPermissionRecommendedTime,
  headOfficeApprovedSchedule,
  pendingRecommendationSlotData,
  pendingApprovalSlotData,
} = require("../controllers/slotController");

const router = express.Router();

router.post("/apply-for-slot", protect, authorizeRoles("airlines"), createSlot);
router.get(
  "/slot/pending",
  protect,
  authorizeRoles("airlines", "flight_permission"),
  getSubmittedSLotData
);
router.get(
  "/slot/approved",
  protect,
  authorizeRoles("airlines"),
  getApprovedSlotData
);
router.get(
  "/slot/pending/recommendation",
  protect,
  authorizeRoles("flight_permission"),
  pendingRecommendationSlotData
);
router.get(
  "/slot/rejected",
  protect,
  authorizeRoles("airlines"),
  getRejectedSlotData
);

router.post(
  "/slot/recommendation",
  protect,
  authorizeRoles("flight_permission"),
  flightPermissionRecommendedTime
);

router.post(
  "/slot/ho_approved",
  protect,
  authorizeRoles("head_office"),
  headOfficeApprovedSchedule
);
router.get(
  "/slot/chartered",
  protect,
  authorizeRoles("airlines"),
  charteredFlights
);

router.get(
  "/slot/pending-approval",
  protect,
  authorizeRoles("head_office"),
  pendingApprovalSlotData
);
router.get("/approved/slots", protect, getAllApprovedSlot);
module.exports = router;
