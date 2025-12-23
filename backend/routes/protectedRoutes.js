const express = require("express");
const router = express.Router();
const { protect, authorizeRoles } = require("../middleware/authMiddleware");

// Head office & Admin
router.get(
  "/head-office",
  protect,
  authorizeRoles("head_office", "admin"),
  (req, res) => {
    res.json({ message: "Head Office Access Granted" });
  }
);

// Flight permission only
router.get(
  "/flight",
  protect,
  authorizeRoles("flight_permission"),
  (req, res) => {
    res.json({ message: "Flight Permission Granted" });
  }
);

// Airlines only
router.get("/airlines", protect, authorizeRoles("airlines"), (req, res) => {
  res.json({ message: "Airlines Access Granted" });
});

module.exports = router;
