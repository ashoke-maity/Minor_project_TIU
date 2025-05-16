const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    eventName:{
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
    createdAt:{
        type: Date,
        default: Date.now
    },
});

module.exports = mongoose.model('Event', eventSchema);