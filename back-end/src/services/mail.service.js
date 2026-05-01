const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.EMAIL_PORT || '465'),
  secure: process.env.EMAIL_SECURE === 'true' || process.env.EMAIL_PORT === '465',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendMail = async ({ to, subject, text, html }) => {
  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM || '"DocTime TJ" <no-reply@doctime.tj>',
      to,
      subject,
      text,
      html,
    });
    console.log('Message sent: %s', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    // Don't throw error to avoid breaking the main request flow
    return null;
  }
};

const sendContactNotification = async (contactData) => {
  const { name, email, message } = contactData;
  
  const subject = `New Contact Form Submission from ${name}`;
  const text = `
    Name: ${name}
    Email: ${email}
    Message: ${message}
  `;
  const html = `
    <h2>New Contact Form Submission</h2>
    <p><strong>Name:</strong> ${name}</p>
    <p><strong>Email:</strong> ${email}</p>
    <p><strong>Message:</strong></p>
    <p>${message}</p>
  `;

  return sendMail({
    to: process.env.ADMIN_EMAIL || 'admin@doctime.tj',
    subject,
    text,
    html,
  });
};

module.exports = { sendMail, sendContactNotification };
