const mailService = require('../services/mail.service');

const submitContactForm = async (req, res, next) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ 
        success: false, 
        message: 'Name, email and message are required' 
      });
    }

    // Send email notification to admin
    await mailService.sendContactNotification({ name, email, message });

    res.status(200).json({ 
      success: true, 
      message: 'Your message has been sent successfully!' 
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { submitContactForm };
