const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require('dotenv');

dotenv.config();

const summaryRoutes = require("./routes/summary.js");
const emailRoutes = require("./routes/email.js");
const userRoutes = require("./routes/user.js");
const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

// Connect DB and start server once
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => console.error("MongoDB error:", err.message));

// Routes
app.use("/api/summary", summaryRoutes);
app.use("/api/email", emailRoutes);
app.use("/api/user", userRoutes);

app.use(
  cors({
    origin: "*",
    optionsSuccessStatus: 200, // Allow all origins (for development purposes; adjust for production)
  })
);