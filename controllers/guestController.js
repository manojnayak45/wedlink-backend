const Guest = require("../models/Guest");

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
