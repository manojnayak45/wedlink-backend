const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

const {
  addGuest,
  getGuests,
  updateGuest,
  deleteGuest,
  bulkUploadGuests,
} = require("../controllers/guestController");

const auth = require("../middleware/authMiddleware");

// ✅ Keep bulk route BEFORE others to avoid conflict
router.post("/bulk/:eventId", auth, upload.single("file"), bulkUploadGuests);
router.post("/:eventId", auth, addGuest);
router.get("/:eventId", auth, getGuests);
router.put("/:id", auth, updateGuest);
router.delete("/:id", auth, deleteGuest);

module.exports = router;
