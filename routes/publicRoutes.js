const express = require("express");
const router = express.Router();
const Guest = require("../models/Guest");
const Event = require("../models/Event");

// ✅ Get guest by 4-digit guestId (public)
router.get("/guest/:guestId", async (req, res) => {
  try {
    const guest = await Guest.findOne({ guestId: req.params.guestId });
    if (!guest) return res.status(404).json({ message: "Guest not found" });
    res.status(200).json(guest);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Get event by ID (public)
router.get("/event/:eventId", async (req, res) => {
  try {
    const event = await Event.findById(req.params.eventId);
    if (!event) return res.status(404).json({ message: "Event not found" });
    res.status(200).json(event);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
