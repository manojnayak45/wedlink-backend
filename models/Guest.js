const mongoose = require("mongoose");

const guestSchema = new mongoose.Schema({
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Event",
  },
  name: String,
  whatsapp: String,
  email: String,
});

module.exports = mongoose.model("Guest", guestSchema);
