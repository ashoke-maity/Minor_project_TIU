const Event = require('../models/AdminEventModel');

const AdminCreateEvent = async (req, res) => {
  try {
    const {
      eventName,
      eventDate,
      eventLocation,
      eventDescription,
      eventSummary,
    } = req.body;

    const newEvent = new Event({
      eventName,
      eventDate,
      eventLocation,
      eventDescription,
      eventSummary,
    });

    await newEvent.save();
    res.status(201).json({ message: 'Event created successfully', event: newEvent });
  } catch (error) {
    res.status(500).json({ message: 'Error creating event', error: error.message });
  }
};

module.exports = AdminCreateEvent