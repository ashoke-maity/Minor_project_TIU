const express = require("express");
const router = express.Router();
const verifyUserToken = require("../middlewares/userAuthMiddleware");
const {
  createPost,
  getUserPosts,
  getAllPosts,
  deletePost,
  likePost,
  unlikePost,
  commentOnPost,
  deleteComment,
  savePost,
  unsavePost,
  editPost,
  getMyPosts,
  getSavedPosts,
  getEventPosts,
  getJobPosts
} = require("../controllers/UserPostController");
const upload = require("../middlewares/uploadMiddleware");

// create post
router.post("/create/post", verifyUserToken, upload.single("media"), createPost);

// see the other users posts in the feed
router.get("/view/others", verifyUserToken, getUserPosts);

// see own post in the feed
router.get("/view/post", verifyUserToken, getAllPosts);

// see own post in the (my posts) section
router.get("/view/my/posts", verifyUserToken, getMyPosts);

// delete post
router.delete("/delete/post/:id", verifyUserToken, deletePost);

// like a post
router.post("/user/like/post/:id", verifyUserToken, likePost);

// unlike a post
router.post("/unlike/post/:id", verifyUserToken, unlikePost);

// comment on a post
router.post(
  "/user/comment/post/:id",
  verifyUserToken,
  commentOnPost
);

// delete a comment
router.delete(
  "/user/delete/comment/:postId/:commentId",
  verifyUserToken,
  deleteComment
);

// edit a post
router.put(
  "/user/edit/post/:id",
  verifyUserToken,
  upload.single("media"),
  editPost
);

// save a post
router.post("/user/save/post/:id", verifyUserToken, savePost);

// unsave a post
router.post("/user/unsave/post/:id", verifyUserToken, unsavePost);

// get saved posts
router.get("/user/saved/posts", verifyUserToken, getSavedPosts);

// get posts related to events
router.get("/user/event/posts", verifyUserToken, getEventPosts);

// get posts related to jobs
router.get("/user/job/posts", verifyUserToken, getJobPosts);

module.exports = router;