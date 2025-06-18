const express = require("express");
const {
  addGuest,
  getGuests,
  updateGuest,
  deleteGuest,
} = require("../controllers/guestController");
const auth = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/:eventId", auth, addGuest);
router.get("/:eventId", auth, getGuests);
router.put("/:id", auth, updateGuest);
router.delete("/:id", auth, deleteGuest);

module.exports = router;
