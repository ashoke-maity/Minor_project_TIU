const express = require('express');
const router = express.Router();
const UserFetchAdminEvents = require('../controllers/UserEventController');
const verifyUserToken = require("../middlewares/userAuthMiddleware");

router.get('/admin-events', verifyUserToken, UserFetchAdminEvents);

module.exports = router;
