const mongoose = require('mongoose');
const adminAnnouncementSchema = require('../models/AdminAnnouncementModel');

const fetchAnnouncementsByUser = async (req, res) => {
    try{
        // Fetch all active announcements
        const announcements = await adminAnnouncementSchema.find({ isActive: true }).sort({ createdAt: -1 });
        res.status(200).json({ data: announcements });
    }catch(error){
        res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports = fetchAnnouncementsByUser;