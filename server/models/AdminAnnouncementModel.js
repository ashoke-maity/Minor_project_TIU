const mongoose = require('mongoose');
const adminAnnouncementSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    isActive: {
        type: Boolean,
        default: true,
    }
}, {
    timestamps: true,
});

module.exports = mongoose.model("AdminAnnouncement", adminAnnouncementSchema);