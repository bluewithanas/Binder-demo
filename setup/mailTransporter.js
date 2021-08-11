const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD // naturally, replace both with your real credentials or an application-specific password
  }
});

module.exports=transporter;