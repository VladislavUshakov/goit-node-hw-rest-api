require("dotenv").config();
const nodemailer = require("nodemailer");

const { EMAIL_PASSWORD: pass } = process.env;

const transporter = nodemailer.createTransport(
  {
    host: "smtp.meta.ua",
    port: 465,
    secure: true,
    auth: {
      user: "vlad.ushakov.977@meta.ua",
      pass,
    },
  },
  {
    from: "vlad.ushakov.977@meta.ua",
  }
);

const sendEmail = async (emailOptions) => {
  await transporter.sendMail(emailOptions);
  return true;
};

module.exports = sendEmail;
