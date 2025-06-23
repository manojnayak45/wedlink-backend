const Event = require("../models/Event");

const createEvent = async (req, res) => {
  try {
    const existingEvent = await Event.findOne({
      name: { $regex: `^${req.body.name}$`, $options: "i" },
    });
    if (existingEvent) {
      return res.status(409).json({ message: "Event name already exists" });
    }

    const event = await Event.create({ ...req.body, adminId: req.admin._id });
    res.status(201).json(event);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to create event", error: error.message });
  }
};

const getEvents = async (req, res) => {
  try {
    const events = await Event.find().populate("adminId", "name");
    res.status(200).json(events);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch events", error: error.message });
  }
};

const getEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate(
      "adminId",
      "email role"
    );

    if (!event || event.adminId._id.toString() !== req.admin._id.toString()) {
      return res
        .status(403)
        .json({ message: "Access denied or event not found" });
    }

    res.status(200).json(event);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch event", error: error.message });
  }
};

const updateEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    res.status(200).json(event);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    if (event.adminId.toString() !== req.admin._id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await Event.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Event deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete", error: error.message });
  }
};

const checkEventName = async (req, res) => {
  try {
    const exists = await Event.exists({
      name: { $regex: `^${req.params.name}$`, $options: "i" },
    });
    res.json({ exists: !!exists });
  } catch (err) {
    res.status(500).json({ message: "Error checking event name" });
  }
};

module.exports = {
  createEvent,
  getEvents,
  getEvent,
  updateEvent,
  deleteEvent,
  checkEventName,
};
