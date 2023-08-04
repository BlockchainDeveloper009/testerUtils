import * as nodemailer from 'nodemailer';
let fromEmail = 'harrypks19@gmail.com';
let toEmail = 'haryston.gk7@gmail.com';

// Create a transporter using the default SMTP transport
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: 'your@gmail.com',     // Your Gmail email address
    pass: 'your-password',      // Your Gmail password (You should use an app password)
  },
});

// Email data
const mailOptions = {
  from: `${fromEmail}`,      // Sender's email address
  to: `${toEmail}`, // Recipient's email address
  subject: 'Test Email',
  text: 'This is a test email sent from Node.js using nodemailer and TypeScript.',
};

// Send the email
transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    console.error('Error sending email:', error);
  } else {
    console.log('Email sent:', info.response);
  }
});
