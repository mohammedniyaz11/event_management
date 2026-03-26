// controllers/event.controller.js
const Event = require("../models/event.model");

exports.createEvent = async (req, res) => {
  try {
    const { title, description, date, time } = req.body;

    const event = await Event.create({
      title,
      description,
      date,
      time,
      createdBy: req.user.id
    });

    res.status(201).json(event);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getEvents = async (req, res) => {
  try {
    const events = await Event.find()
      .populate("createdBy", "name email")
      .populate("participants", "name email");

    res.json(events);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event)
      return res.status(404).json({ message: "Event not found" });

    // Only creator can update
    if (event.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not allowed" });
    }

    Object.assign(event, req.body);

    await event.save();

    res.json(event);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event)
      return res.status(404).json({ message: "Event not found" });

    if (event.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not allowed" });
    }

    await event.deleteOne();

    res.json({ message: "Event deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.registerEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event)
      return res.status(404).json({ message: "Event not found" });

    // Prevent duplicate registration
    if (event.participants.includes(req.user.id)) {
      return res.status(400).json({ message: "Already registered" });
    }

    event.participants.push(req.user.id);

    await event.save();

    res.json({
      message: "Registered successfully",
      event
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};