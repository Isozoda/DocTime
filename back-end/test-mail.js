require('dotenv').config();
const { sendMail } = require('./src/services/mail.service');

async function test() {
  console.log('--- Email Configuration Test ---');
  console.log('Host:', process.env.EMAIL_HOST);
  console.log('Port:', process.env.EMAIL_PORT);
  console.log('User:', process.env.EMAIL_USER);
  console.log('--------------------------------');

  if (!process.env.EMAIL_USER || process.env.EMAIL_USER.includes('your-email')) {
    console.error('ERROR: Please update your EMAIL_USER and EMAIL_PASS in the .env file first!');
    process.exit(1);
  }

  const result = await sendMail({
    to: process.env.ADMIN_EMAIL,
    subject: 'DocTime - Real Email Test',
    text: 'This is a test email from your DocTime backend. If you received this, your email configuration is working perfectly!',
    html: '<h1>Success!</h1><p>This is a test email from your <b>DocTime</b> backend. If you received this, your email configuration is working perfectly!</p>',
  });

  if (result) {
    console.log('SUCCESS: Test email sent successfully!');
  } else {
    console.log('FAILED: Could not send test email. Check your credentials and server logs.');
  }
}

test();
