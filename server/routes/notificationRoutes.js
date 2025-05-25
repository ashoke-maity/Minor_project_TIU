const express = require("express");
const {
  getNotifications,
  markNotificationAsRead,
  deleteNotification,
} = require("../controllers/notificationController");
const verifyUserToken = require("../middlewares/userAuthMiddleware");

const router = express.Router();

router.get("/notifications", verifyUserToken, getNotifications);
router.put("/:notificationId/read", verifyUserToken, markNotificationAsRead);
router.delete("/:notificationId", verifyUserToken, deleteNotification);

module.exports = router;
