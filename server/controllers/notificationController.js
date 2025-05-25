const Notification = require("../models/notification");

const getNotifications = async (req, res) => {
  try {
    const userId = req.user.id;
    const { unread } = req.query;

    const query = { recipient: userId };
    if (unread === "true") query.isRead = false;

    const notifications = await Notification.find(query)
      .sort({ createdAt: -1 })
      .populate("sender", "FirstName LastName");

    res.status(200).json({ status: 1, notifications });
  } catch (err) {
    console.error("Fetch Notifications Error:", err);
    res.status(500).json({ status: 0, msg: "Server error" });
  }
};

const markNotificationAsRead = async (req, res) => {
  try {
    const { notificationId } = req.params;

    await Notification.findByIdAndUpdate(notificationId, { isRead: true });

    res.status(200).json({ status: 1, msg: "Notification marked as read" });
  } catch (err) {
    console.error("Mark Read Error:", err);
    res.status(500).json({ status: 0, msg: "Server error" });
  }
};

const deleteNotification = async (req, res) => {
  try {
    const { notificationId } = req.params;

    await Notification.findByIdAndDelete(notificationId);

    res.status(200).json({ status: 1, msg: "Notification deleted" });
  } catch (err) {
    console.error("Delete Notification Error:", err);
    res.status(500).json({ status: 0, msg: "Server error" });
  }
};

module.exports = {
  getNotifications,
  markNotificationAsRead,
  deleteNotification,
};