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
    let mediaPublicId = null;
    let mediaResourceType = null;

    // If media is present, upload to Cloudinary
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
      mediaPublicId = uploadResult.public_id;
      mediaResourceType = uploadResult.resource_type;
    }

    const newEvent = new Event({
      eventName,
      eventDate,
      eventLocation,
      eventDescription,
      eventSummary,
      mediaUrl,
      mediaPublicId,
      mediaResourceType,
    });

    await newEvent.save();
    res.status(201).json({ message: 'Event created successfully', event: newEvent });
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
    let mediaPublicId = null;
    let mediaResourceType = null;

    // If new media is uploaded, update it on Cloudinary
    if (req.file) {
      const streamifier = require('streamifier');
      // Delete previous media from Cloudinary if exists
      const event = await Event.findById(id);
      if (event && event.mediaPublicId && event.mediaResourceType && typeof event.mediaPublicId === 'string' && event.mediaPublicId.trim() !== '') {
        try {
          console.log('Deleting previous media from Cloudinary:', event.mediaPublicId, 'with resource type:', event.mediaResourceType);
          await cloudinary.uploader.destroy(event.mediaPublicId, { resource_type: event.mediaResourceType });
        } catch (delErr) {
          console.warn('Failed to delete previous media from Cloudinary:', delErr.message);
        }
      } else {
        console.log('No previous mediaPublicId/resourceType found for event:', id);
      }
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
      mediaPublicId = uploadResult.public_id;
      mediaResourceType = uploadResult.resource_type;
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
        ...(mediaPublicId && { mediaPublicId }),
        ...(mediaResourceType && { mediaResourceType }),
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
    const event = await Event.findById(id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    // Delete media from Cloudinary if present
    if (event.mediaPublicId) {
      try {
        await cloudinary.uploader.destroy(event.mediaPublicId, {
          resource_type: event.mediaResourceType || 'image',
        });
      } catch (err) {
        console.warn('Failed to delete event media from Cloudinary:', err.message);
      }
    }
    await event.deleteOne();
    res.status(200).json({ message: 'Event deleted successfully', event });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting event', error: error.message });
  }
};


module.exports = {AdminCreateEvent, AdminGetEvents, AdminDeleteEvent, AdminUpdateEvent};