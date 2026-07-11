const notificationRouter = require("express").Router();

const {
  getNotifications,
  readNotification,
} = require("../controllers/notificationController");

const authMiddleware = require("../middlewares/authMiddleware");
const authorizeRoles = require("../middlewares/authorizeRoles");

notificationRouter.get(
  "/",
  authMiddleware,
  authorizeRoles("USER", "ADMIN"),
  getNotifications,
);

notificationRouter.patch(
  "/:id/read",
  authMiddleware,
  authorizeRoles("USER", "ADMIN"),
  readNotification,
);

module.exports = notificationRouter;
