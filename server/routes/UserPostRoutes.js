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
} = require("../controllers/UserPostController");
const upload = require("../middlewares/uploadMiddleware");

// create post
router.post(
  "/create/post",
  verifyUserToken,
  upload.single("media"),
  createPost
);

// see the other users posts
router.get("/view/others", verifyUserToken, getUserPosts);

// see own post
router.get("/view/post", verifyUserToken, getAllPosts);

// delete post
router.delete("/delete/post/:id", verifyUserToken, deletePost);

// like a post
router.post("/like/post/:id", verifyUserToken, likePost);

// unlike a post
router.post("/unlike/post/:id", verifyUserToken, unlikePost);

// comment on a post
router.post(
  "/comment/post/:id",
  verifyUserToken,
  commentOnPost
);

// delete a comment
router.delete(
  "/delete/comment/:postId/:commentId",
  verifyUserToken,
  deleteComment
);

// save a post
router.post("/save/post/:id", verifyUserToken, savePost);

// unsave a post
router.post("/unsave/post/:id", verifyUserToken, unsavePost);

module.exports = router;