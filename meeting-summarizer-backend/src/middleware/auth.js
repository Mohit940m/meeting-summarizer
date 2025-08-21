
const jwt = require("jsonwebtoken");

// Local JWT authentication middleware
// Expects Authorization: Bearer <token>
module.exports = function checkJwt(req, res, next) {
  const authHeader = req.headers["authorization"] || req.headers["Authorization"];
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ success: false, error: "Missing or invalid Authorization header" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // attach user info to req.user
    req.user = decoded; // should contain at least { id, email }
    next();
  } catch (err) {
    return res.status(401).json({ success: false, error: "Invalid or expired token" });
  }
};