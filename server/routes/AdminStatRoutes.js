const express = require('express');
const router = express.Router();
const {
  getNumberOfUsers,
  TotalNumberOfJobsPosted,
  TotalNumberOfEventsPosted,
  TotalNumberOfStoriesPosted,
  userActivity,
} = require('../controllers/AdminStatController');

// const verifyUserToken = require("../middlewares/userAuthMiddleware");
const verifyToken = require("../middlewares/adminAuthMiddleware");

router.get('/user-count', verifyToken, getNumberOfUsers);
router.get('/job-count', verifyToken, TotalNumberOfJobsPosted);
router.get('/event-count', verifyToken, TotalNumberOfEventsPosted);
router.get('/story-count', verifyToken, TotalNumberOfStoriesPosted);
router.get('/user-activity', verifyToken, userActivity);

module.exports = router;