const express = require("express");
const { protect, authorizeRoles } = require("../middleware/authMiddleware");

const { createAirlines } = require("../controllers/airlinesControllers");

const router = express.Router();

router.post(
  "/create-airlines",
  protect,
  authorizeRoles("admin"),
  createAirlines
);

module.exports = router;
