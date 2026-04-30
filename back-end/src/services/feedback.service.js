const prisma = require('../config/prisma');
const { createError } = require('../middlewares/error.middleware');

const submitFeedback = async (userId, { subject, message }) => {
  if (!subject || !subject.trim()) throw createError(400, 'Subject is required');
  if (!message || !message.trim()) throw createError(400, 'Message is required');

  return prisma.feedback.create({
    data: {
      userId,
      subject: subject.trim(),
      message: message.trim(),
    },
    include: {
      user: { select: { id: true, name: true, email: true } },
    },
  });
};

const getMyFeedbacks = async (userId) => {
  return prisma.feedback.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });
};

// Admin: get all feedbacks
const getAllFeedbacks = async ({ page = 1, limit = 20 } = {}) => {
  const skip = (Number(page) - 1) * Number(limit);

  const [feedbacks, total] = await Promise.all([
    prisma.feedback.findMany({
      include: {
        user: { select: { id: true, name: true, email: true } },
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: Number(limit),
    }),
    prisma.feedback.count(),
  ]);

  return {
    feedbacks,
    pagination: {
      total,
      page: Number(page),
      limit: Number(limit),
      pages: Math.ceil(total / Number(limit)),
    },
  };
};

const deleteFeedback = async (feedbackId, userId, role) => {
  const feedback = await prisma.feedback.findUnique({ where: { id: feedbackId } });
  if (!feedback) throw createError(404, 'Feedback not found');
  if (role !== 'admin' && feedback.userId !== userId) throw createError(403, 'Forbidden');

  await prisma.feedback.delete({ where: { id: feedbackId } });
};

module.exports = { submitFeedback, getMyFeedbacks, getAllFeedbacks, deleteFeedback };
