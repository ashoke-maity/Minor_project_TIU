const express = require('express');
const router = express.Router();
const multer = require('multer');
const AdminCreateEvent = require('../controllers/AdminEventController');
const verifyToken = require('../middlewares/adminAuthMiddleware');

// Set up multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Route with media upload
router.post('/admin/event', verifyToken, upload.single('media'), AdminCreateEvent);

module.exports = router;
