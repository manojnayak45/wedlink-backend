const mongoose = require("mongoose");

const guestSchema = new mongoose.Schema({
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Event",
  },
  name: String,
  whatsapp: String,
  email: String,
  guestId: {
    type: String,
    unique: true,
    required: true,
  },
});

module.exports = mongoose.model("Guest", guestSchema);
