const express = require("express");
const { protect, authorizeRoles } = require("../middleware/authMiddleware");

const { getDailyCongestion } = require("../controllers/congestionController");

const router = express.Router();

router.get("/requested-congestion", protect, getDailyCongestion);

module.exports = router;
