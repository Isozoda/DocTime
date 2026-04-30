const feedbackService = require('../services/feedback.service');

const submitFeedback = async (req, res, next) => {
  try {
    const data = await feedbackService.submitFeedback(req.user.id, req.body);
    res.status(201).json({ success: true, data });
  } catch (err) { next(err); }
};

const getMyFeedbacks = async (req, res, next) => {
  try {
    const data = await feedbackService.getMyFeedbacks(req.user.id);
    res.status(200).json({ success: true, data });
  } catch (err) { next(err); }
};

const getAllFeedbacks = async (req, res, next) => {
  try {
    const data = await feedbackService.getAllFeedbacks(req.query);
    res.status(200).json({ success: true, data });
  } catch (err) { next(err); }
};

const deleteFeedback = async (req, res, next) => {
  try {
    await feedbackService.deleteFeedback(req.params.id, req.user.id, req.user.role);
    res.status(200).json({ success: true, message: 'Feedback deleted' });
  } catch (err) { next(err); }
};

module.exports = { submitFeedback, getMyFeedbacks, getAllFeedbacks, deleteFeedback };
