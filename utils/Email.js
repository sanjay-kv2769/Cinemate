const nodemailer = require('nodemailer');

const sendmail = async (option) => {
  //CREATE A TRANSPORTER
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
  //DEFINE EMAIL OPTIONS
  const emailOptions = {
    from: 'Cinemat support<support@cinemat.com>',
    to: option.email,
    subject: option.subject,
    text: option.message,
  };
  await transporter.sendMail(emailOptions);
};

module.exports = sendmail;
