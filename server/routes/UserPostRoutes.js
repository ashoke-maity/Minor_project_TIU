const express = require('express');
const router = express.Router();
const verifyUserToken = require('../middlewares/userAuthMiddleware');
const {createPost, getUserPosts, getAllPosts, deletePost} = require('../controllers/UserPostController');

// create post
router.post("/create/post", verifyUserToken, createPost)

// see the other users posts
router.get("/view/others", verifyUserToken, getUserPosts)

// see own post
router.get("/view/post", verifyUserToken, getAllPosts)

// delete post
router.delete("/delete/post/:id", verifyUserToken, deletePost);

module.exports = router;