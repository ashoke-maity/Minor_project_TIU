const Event = require('../models/AdminEventModel');
const cloudinary = require('../config/cloudinary');

const AdminCreateEvent = async (req, res) => {
  try {
    const {
      eventName,
      eventDate,
      eventLocation,
      eventDescription,
      eventSummary,
    } = req.body;

    let mediaUrl = null;

    // If media is present, upload to Cloudinary
    if (req.file) {
      const result = await cloudinary.uploader.upload_stream(
        { resource_type: 'auto' },
        (error, result) => {
          if (error) {
            console.error('Cloudinary Upload Error:', error);
            return res.status(500).json({ message: 'Failed to upload media', error });
          }

          mediaUrl = result.secure_url;

          // Create and save the event after successful media upload
          const newEvent = new Event({
            eventName,
            eventDate,
            eventLocation,
            eventDescription,
            eventSummary,
            mediaUrl,
          });

          newEvent.save()
            .then((savedEvent) => {
              res.status(201).json({ message: 'Event created successfully', event: savedEvent });
            })
            .catch((saveError) => {
              res.status(500).json({ message: 'Error saving event', error: saveError.message });
            });
        }
      );

      // Pipe the file buffer into Cloudinary
      require('streamifier').createReadStream(req.file.buffer).pipe(result);
    } else {
      // No media; just save event normally
      const newEvent = new Event({
        eventName,
        eventDate,
        eventLocation,
        eventDescription,
        eventSummary,
        mediaUrl: null,
      });

      await newEvent.save();
      res.status(201).json({ message: 'Event created successfully', event: newEvent });
    }

  } catch (error) {
    res.status(500).json({ message: 'Error creating event', error: error.message });
  }
};

// admin can fetch their own events
const AdminGetEvents = async (req, res) => {
  try {
    const events = await Event.find().sort({ eventDate: -1 }); // Optional: sorts newest first
    res.status(200).json({ message: 'Events fetched successfully', events });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching events', error: error.message });
  }
};

// admin can update their own event
const AdminUpdateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      eventName,
      eventDate,
      eventLocation,
      eventDescription,
      eventSummary,
    } = req.body;

    let mediaUrl = null;

    // If new media is uploaded, update it on Cloudinary
    if (req.file) {
      const streamifier = require('streamifier');

      const uploadResult = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { resource_type: 'auto' },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        );
        streamifier.createReadStream(req.file.buffer).pipe(uploadStream);
      });

      mediaUrl = uploadResult.secure_url;
    }

    // Find and update the event
    const updatedEvent = await Event.findByIdAndUpdate(
      id,
      {
        eventName,
        eventDate,
        eventLocation,
        eventDescription,
        eventSummary,
        ...(mediaUrl && { mediaUrl }), // only set if mediaUrl exists
      },
      { new: true }
    );

    if (!updatedEvent) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.status(200).json({ message: 'Event updated successfully', event: updatedEvent });
  } catch (error) {
    res.status(500).json({ message: 'Error updating event', error: error.message });
  }
};

// admin can delete own event
const AdminDeleteEvent = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedEvent = await Event.findByIdAndDelete(id);

    if (!deletedEvent) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.status(200).json({ message: 'Event deleted successfully', event: deletedEvent });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting event', error: error.message });
  }
};


module.exports = {AdminCreateEvent, AdminGetEvents, AdminDeleteEvent, AdminUpdateEvent};