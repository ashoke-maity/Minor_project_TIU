const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    eventName: {
        type: String,
        required: true
    },
    eventDate: {
        type: Date,
        required: true
    },
    eventLocation: {
        type: String,
        required: true
    },
    eventDescription: {
        type: String,
        required: true
    },
    eventSummary: {
        type: String,
        required: true
    },
    mediaUrl: {
        type: String,  // URL of uploaded image or video on Cloudinary
        default: null   // optional field, so default null if no media uploaded
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
});

module.exports = mongoose.model('Event', eventSchema);