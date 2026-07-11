const service = require("../services/notificationService");

async function getNotifications(req, res) {
  try {
    const userId = req.user.id;

    const notifications = await service.getUserNotifications(userId);

    return res.json(notifications);
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
}

async function readNotification(req, res) {
  try {
    const { id } = req.params;

    const notification = await service.readNotification(id, req.user.id);

    return res.json(notification);
  } catch (error) {
    return res.status(404).json({
      message: error.message,
    });
  }
}

module.exports = {
  getNotifications,
  readNotification,
};
