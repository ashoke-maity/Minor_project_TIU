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

module.exports = AdminCreateEvent;