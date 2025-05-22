const Event = require('../models/AdminEventModel');

// Controller to fetch events posted by admin for users
const UserFetchAdminEvents = async (req, res) => {
  try {
    const events = await Event.find().sort({ eventDate: -1 }); // Sorted by latest events
    res.status(200).json({ success: true, events });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch admin events', error: error.message });
  }
};

module.exports = {
  UserFetchAdminEvents,
};
