const express = require('express');
const router = express.Router();
const multer = require('multer');
const {
  AdminCreateEvent,
  AdminGetEvents,
  AdminUpdateEvent,
  AdminDeleteEvent
} = require('../controllers/AdminEventController');
const verifyToken = require('../middlewares/adminAuthMiddleware');

// Set up multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Create new event
router.post('/admin/event', verifyToken, upload.single('media'), AdminCreateEvent);

// Get all admin events
router.get('/admin/events', verifyToken, AdminGetEvents);

// Update an event by ID
router.put('/admin/event/:id', verifyToken, upload.single('media'), AdminUpdateEvent);

// Delete an event by ID
router.delete('/admin/event/:id', verifyToken, AdminDeleteEvent);

module.exports = router;
