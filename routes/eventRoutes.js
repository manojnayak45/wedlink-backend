const express = require("express");
const router = express.Router();
const {
  createEvent,
  getEvents,
  getEvent,
  updateEvent,
  deleteEvent,
  checkEventName,
} = require("../controllers/eventController");

const auth = require("../middleware/authMiddleware");
const Event = require("../models/Event");

// 🆕 Public route for invitation frontend
router.get("/public/:id", async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).select(
      "name groomName brideName location date description template"
    );
    if (!event) return res.status(404).json({ message: "Event not found" });
    res.status(200).json(event);
  } catch (err) {
    res.status(500).json({ message: "Error fetching public event" });
  }
});

// ✅ Protected routes
router.post("/", auth, createEvent);
router.get("/", auth, getEvents);
router.get("/check-name/:name", auth, checkEventName);
router.get("/:id", auth, getEvent);
router.delete("/:id", auth, deleteEvent);
router.put("/:id", auth, updateEvent);

module.exports = router;
