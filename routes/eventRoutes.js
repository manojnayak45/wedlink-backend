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

// ✅ Routes
router.post("/", auth, createEvent);
router.get("/", auth, getEvents);
router.get("/check-name/:name", auth, checkEventName); // ⬅️ using controller

router.get("/:id", auth, getEvent);
router.delete("/:id", auth, deleteEvent);
router.put(
  "/:id",
  auth,
  (req, res, next) => {
    console.log("✅ PUT /api/events/:id hit");
    next();
  },
  updateEvent
);

module.exports = router;
