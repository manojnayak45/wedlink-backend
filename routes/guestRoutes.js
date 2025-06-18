const express = require("express");
const {
  addGuest,
  getGuests,
  updateGuest,
  deleteGuest,
} = require("../controllers/guestController");
const auth = require("../middleware/authMiddleware");
const { bulkUploadGuests } = require("../controllers/guestController");
const router = express.Router();
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

router.post("/:eventId", auth, addGuest);
router.get("/:eventId", auth, getGuests);
router.put("/:id", auth, updateGuest);
router.delete("/:id", auth, deleteGuest);
router.post("/bulk/:eventId", auth, upload.single("file"), bulkUploadGuests);

module.exports = router;
