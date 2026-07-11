const prisma = require("../lib/prisma.js");

async function createConversation(data) {
  return prisma.conversation.create({
    data,
  });
}

async function findConversationByItemAndParticipant(
  itemId,
  ownerId,
  participantId,
) {
  return prisma.conversation.findFirst({
    where: {
      itemId,
      ownerId,
      participantId,
    },
    include: {
      item: true,
      owner: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      participant: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });
}

async function findConversationById(id) {
  return prisma.conversation.findUnique({
    where: {
      id,
    },
    include: {
      item: true,
      owner: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      participant: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });
}

async function findUserConversations(userId) {
  return prisma.conversation.findMany({
    where: {
      OR: [{ ownerId: userId }, { participantId: userId }],
    },
    include: {
      item: {
        select: {
          id: true,
          title: true,
          photoUrl: true,
        },
      },
      owner: {
        select: {
          id: true,
          name: true,
        },
      },
      participant: {
        select: {
          id: true,
          name: true,
        },
      },
    },
    orderBy: {
      updatedAt: "desc",
    },
  });
}

async function createMessage(data) {
  return prisma.message.create({
    data,
    include: {
      sender: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });
}

async function findMessagesByConversation(conversationId) {
  return prisma.message.findMany({
    where: {
      conversationId,
    },
    include: {
      sender: {
        select: {
          id: true,
          name: true,
        },
      },
    },
    orderBy: {
      createdAt: "asc",
    },
  });
}

async function markMessagesAsRead(conversationId, userId) {
  return prisma.message.updateMany({
    where: {
      conversationId,
      senderId: {
        not: userId,
      },
      isRead: false,
    },
    data: {
      isRead: true,
    },
  });
}

module.exports = {
  createConversation,
  findConversationByItemAndParticipant,
  findConversationById,
  findUserConversations,
  createMessage,
  findMessagesByConversation,
  markMessagesAsRead,
};
