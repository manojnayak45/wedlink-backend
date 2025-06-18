const Guest = require("../models/Guest");
const xlsx = require("xlsx");

exports.addGuest = async (req, res) => {
  try {
    const guest = await Guest.create({
      ...req.body,
      eventId: req.params.eventId,
    });
    res.status(201).json(guest);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getGuests = async (req, res) => {
  try {
    const guests = await Guest.find({ eventId: req.params.eventId });
    res.status(200).json(guests);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateGuest = async (req, res) => {
  try {
    const updated = await Guest.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteGuest = async (req, res) => {
  try {
    await Guest.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.bulkUploadGuests = async (req, res) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ message: "No file uploaded" });

    const workbook = xlsx.readFile(file.path);
    const sheetName = workbook.SheetNames[0];
    const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

    // Map data with eventId
    const guests = data.map((guest) => ({
      name: guest.name || guest.Name,
      whatsapp: guest.whatsapp || guest.Whatsapp,
      email: guest.email || guest.Email,
      eventId: req.params.eventId,
    }));

    await Guest.insertMany(guests);

    res.status(201).json({ message: "Guests added successfully" });
  } catch (err) {
    console.error("Bulk upload failed:", err);
    res.status(500).json({ message: "Bulk upload failed" });
  }
};
