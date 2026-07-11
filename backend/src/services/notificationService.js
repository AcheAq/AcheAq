const repository = require("../repositories/notificationRepository");

async function createNotification(data) {
  return repository.createNotification(data);
}

async function getUserNotifications(userId) {
  return repository.findByUser(userId);
}

async function readNotification(id, userId) {
  const notification = await repository.findById(id);

  if (!notification) {
    throw new Error("Notification not found");
  }

  if (notification.userId !== userId) {
    throw new Error("Access denied");
  }

  return repository.markAsRead(id);
}

module.exports = {
  createNotification,
  getUserNotifications,
  readNotification,
};
