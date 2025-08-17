const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

// const connectDB = require("./config/db");
const summaryRoutes = require("./routes/summary.js");
const emailRoutes = require("./routes/email.js");
const userRoutes = require("./routes/user.js");


dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// Connect DB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("MongoDB error:", err.message));

// Protected routes
app.use("/api/summary", summaryRoutes);
app.use("/api/email", emailRoutes);
app.use("/api/user", userRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));