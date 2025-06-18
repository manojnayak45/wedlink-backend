// routes/admin.js

const express = require("express");
const router = express.Router();
const Event = require("../models/Event");
const Admin = require("../models/Admin");

// GET /admin/overview
router.get("/overview", async (req, res) => {
  try {
    const totalEvents = await Event.countDocuments();
    const totalAdmins = await Admin.countDocuments();

    // You can compute real growth/decline stats here if needed
    const growthPercentage = 75;
    const declinePercentage = 25;

    res.json({
      totalEvents,
      totalAdmins,
      growthPercentage,
      declinePercentage,
    });
  } catch (err) {
    console.error("❌ Failed to fetch admin overview:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
