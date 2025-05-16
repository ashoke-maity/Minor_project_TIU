const express = require('express');
const router = express.Router();
const AdminCreateEvent= require('../controllers/AdminEventController');
const verifyToken = require('../middlewares/adminAuthMiddleware'); // your middleware

router.post('/admin/create', verifyToken, AdminCreateEvent);

module.exports = router;
