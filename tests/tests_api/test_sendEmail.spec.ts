const axios = require('axios');

const SENDGRID_API_KEY = 'YOUR_SENDGRID_API_KEY';

const data = {
  personalizations: [
    {
      to: [
        {
          email: 'recipient@example.com',
        },
      ],
      subject: 'Test Email',
    },
  ],
  from: {
    email: 'sender@example.com',
    name: 'Sender Name',
  },
  content: [
    {
      type: 'text/plain',
      value: 'This is a test email sent using Axios and SendGrid!',
    },
  ],
};

axios.post('https://api.sendgrid.com/v3/mail/send', data, {
  headers: {
    Authorization: `Bearer ${SENDGRID_API_KEY}`,
  },
})
  .then(response => {
    console.log('Email sent successfully!', response.data);
  })
  .catch(error => {
    console.error('Error sending email:', error);
  });
