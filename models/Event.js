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
  groomName: { type: String, default: "" },
  brideName: { type: String, default: "" },
  date: String,
  location: String,
  description: String,
  template: {
    type: String,
    enum: ["template1", "template2"],
    default: "template1",
  },
});

// ✅ Add case-insensitive unique index on event name
eventSchema.index(
  { name: 1 },
  { unique: true, collation: { locale: "en", strength: 2 } }
);

module.exports = mongoose.models.Event || mongoose.model("Event", eventSchema);
