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
    // express-oauth2-jwt-bearer attaches token data on req.auth.payload
    const payload = req.auth?.payload || {};
    const userInfo = {
      userId: payload.sub || null, // Auth0 user id (e.g., auth0|123456)
      email: payload.email || null,
      roles: payload["https://yourdomain.com/roles"] || [], // if custom roles claim added
    };

    res.json({ success: true, user: userInfo });
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to fetch user profile" });
  }
});

module.exports = router;