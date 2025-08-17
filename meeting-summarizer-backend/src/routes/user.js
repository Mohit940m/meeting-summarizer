const express = require("express");
const checkJwt = require("../middleware/checkJwt");

const router = express.Router();

/**
 * @route GET /api/user/profile
 * @desc Get the logged-in user's profile (from Auth0 JWT)
 * @access Private
 */
router.get("/profile", checkJwt, (req, res) => {
  try {
    // `req.auth` contains decoded token data
    const userInfo = {
      userId: req.auth.sub,       // Auth0 user id (like auth0|123456)
      email: req.auth?.claims?.email || null,
      roles: req.auth?.claims?.["https://yourdomain.com/roles"] || [], // if roles added
    };

    res.json({ success: true, user: userInfo });
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to fetch user profile" });
  }
});

module.exports = router;