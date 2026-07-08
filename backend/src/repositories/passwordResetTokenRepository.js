const prisma = require("../lib/prisma.js");

async function create(data) {
  return await prisma.passwordResetToken.create({
    data,
  });
}

async function findValidToken(token) {
  return await prisma.passwordResetToken.findFirst({
    where: {
      token,
      usedAt: null,
      expiresAt: {
        gt: new Date(),
      },
    },
    include: {
      user: true,
    },
  });
}

async function markAsUsed(id) {
  return await prisma.passwordResetToken.update({
    where: {
      id,
    },
    data: {
      usedAt: new Date(),
    },
  });
}

async function deleteByUserId(userId) {
  return await prisma.passwordResetToken.deleteMany({
    where: {
      userId,
    },
  });
}

module.exports = {
  create,
  findValidToken,
  markAsUsed,
  deleteByUserId,
};
