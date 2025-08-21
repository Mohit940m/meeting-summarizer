const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

function signToken(user) {
  return jwt.sign(
    {
      id: user._id.toString(),
      email: user.email,
      username: user.username,
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
}

exports.register = async (req, res) => {
  try {
    const { email, username, password, confirmPassword } = req.body;

    if (!email || !username || !password || !confirmPassword) {
      return res.status(400).json({ success: false, error: "All fields are required" });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ success: false, error: "Passwords do not match" });
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(409).json({ success: false, error: "Email already registered" });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = await User.create({ email: email.toLowerCase(), username, passwordHash });

    const token = signToken(user);

    res.status(201).json({
      success: true,
      user: { id: user._id, email: user.email, username: user.username },
      token,
    });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ success: false, error: "Server error" });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, error: "Email and password are required" });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ success: false, error: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ success: false, error: "Invalid credentials" });
    }

    const token = signToken(user);
    res.json({
      success: true,
      user: { id: user._id, email: user.email, username: user.username },
      token,
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ success: false, error: "Server error" });
  }
};

exports.profile = async (req, res) => {
  try {
    // req.user is set by auth middleware
    const { id } = req.user || {};
    if (!id) return res.status(401).json({ success: false, error: "Unauthorized" });

    const user = await User.findById(id).select("_id email username createdAt updatedAt");
    if (!user) return res.status(404).json({ success: false, error: "User not found" });

    res.json({ success: true, user });
  } catch (err) {
    console.error("Profile error:", err);
    res.status(500).json({ success: false, error: "Server error" });
  }
};
