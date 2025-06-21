const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const cookieParser = require("cookie-parser");

const authRoutes = require("./routes/authRoutes");
const eventRoutes = require("./routes/eventRoutes");
const guestRoutes = require("./routes/guestRoutes");
const adminRoutes = require("./routes/admin");
const publicRoutes = require("./routes/publicRoutes");

const app = express();

app.set("trust proxy", 1); // Needed for secure cookies on platforms like Render

// ✅ CORS configuration (Only allow Vercel frontend URLs)
const corsOptions = {
  origin: [
    "https://wedlink-frontend.vercel.app",
    "https://wedlink-ui.vercel.app",
  ],
  credentials: true,
};

// ✅ CORS middleware (must come before others)
app.use(cors(corsOptions));

// ✅ Body parser and cookie parser
app.use(express.json());
app.use(cookieParser());

// ✅ API routes
app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/guests", guestRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/public", publicRoutes);

// ✅ Catch-all for unknown routes
app.use("*", (req, res) => {
  res.status(404).json({ message: "Route not found", url: req.originalUrl });
});

// ✅ Connect to MongoDB and start server
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(process.env.PORT, () => {
      console.log(`🚀 Server running on port ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1);
  });
