const express = require("express");
const checkJwt = require("../middleware/auth");
const { register, login, profile } = require("../controllers/userController");

const router = express.Router();

// Public routes
router.post("/register", register);
router.post("/login", login);

// Protected route
router.get("/profile", checkJwt, profile);

module.exports = router;