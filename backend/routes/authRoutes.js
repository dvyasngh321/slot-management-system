const express = require("express");
const router = express.Router();

const { registerUser, loginUser } = require("../controllers/authControllers");

const { protect, authorizeRoles } = require("../middleware/authMiddleware");

router.post("/register", registerUser);
router.post("/login", loginUser);

module.exports = router;
