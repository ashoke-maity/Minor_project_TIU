const express=require('express');
const router=express.Router();
const fetchAnnouncementsByUser=require('../controllers/FetchAnnouncementByUserController');
const verifyUserToken = require("../middlewares/userAuthMiddleware");

router.get('/view/admin/announcements', verifyUserToken, fetchAnnouncementsByUser);

module.exports=router;
