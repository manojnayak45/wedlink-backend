const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, default: "editor" },
});

module.exports = mongoose.models.Admin || mongoose.model("Admin", adminSchema);
