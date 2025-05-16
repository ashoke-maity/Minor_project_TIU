const express = require('express');
const router = express.Router();
const { uploadImage } = require('../controllers/cloudinaryController');
const upload = require('../middlewares/uploadMiddleware');
const verifyUserToken = require('../middlewares/userAuthMiddleware');
const verifyToken = require('../middlewares/adminAuthMiddleware');

// Admin upload
router.post('/admin/upload', verifyToken, upload.single('image'), uploadImage);

// User upload
router.post('/user/upload', verifyUserToken, upload.single('image'), uploadImage);

module.exports = router;
