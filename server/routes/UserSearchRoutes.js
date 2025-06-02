const express = require('express');
const router = express.Router();
const UserSearchController = require('../controllers/UserSearchController');
const verifyUserToken = require('../middlewares/userAuthMiddleware');
const verifyAdminToken = require('../middlewares/adminAuthMiddleware');

router.get('/search/users', verifyUserToken, UserSearchController.searchUsers);
router.get('/search/jobs', verifyUserToken, verifyAdminToken, UserSearchController.searchJobs);
router.get('/search/events', verifyUserToken, verifyAdminToken, UserSearchController.searchEvents);
router.get('/search/stories', verifyUserToken, verifyAdminToken, UserSearchController.searchStories);
router.get('/search/posts', verifyUserToken, UserSearchController.searchPosts);

router.get('/search/all', verifyUserToken, UserSearchController.combinedSearch);
module.exports = router;