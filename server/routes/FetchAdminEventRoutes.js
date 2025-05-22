const express = require('express');
const router = express.Router();
const { UserFetchAdminEvents } = require('../controllers/UserEventController');

router.get('/admin-events', UserFetchAdminEvents);

module.exports = router;
