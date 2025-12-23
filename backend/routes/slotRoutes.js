const express = require("express");
const { protect, authorizeRoles } = require("../middleware/authMiddleware");

const { createSlot } = require("../controllers/slotController");

const router = express.Router();

router.post("/apply-for-slot", protect, authorizeRoles("airlines"), createSlot);

module.exports = router;
