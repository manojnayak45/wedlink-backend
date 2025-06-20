// models/Event.js
const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Admin",
    required: true,
  },
  name: {
    type: String,
    required: true,
    unique: true,
  },
  groomName: {
    type: String,
    default: "",
  },
  brideName: {
    type: String,
    default: "",
  },
  date: String,
  location: String,
  description: String,
});

module.exports = mongoose.models.Event || mongoose.model("Event", eventSchema);
