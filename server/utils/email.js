const nodemailer = require('nodemailer');

const {
  SMTP_HOST,
  SMTP_PORT,
  SMTP_EMAIL,
  SMTP_PASSWORD,
  FROM_NAME
} = process.env;

let transporter;

function getTransporter() {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: Number(SMTP_PORT) || 587,
      secure: false,
      auth: {
        user: SMTP_EMAIL,
        pass: SMTP_PASSWORD
      }
    });
  }
  return transporter;
}

function isConfigured() {
  return Boolean(SMTP_HOST && SMTP_PORT && SMTP_EMAIL && SMTP_PASSWORD);
}

async function sendMail({ to, subject, text, html }) {
  if (!isConfigured()) {
    return { skipped: true, reason: 'SMTP not configured' };
  }
  const t = getTransporter();
  const from = FROM_NAME ? `${FROM_NAME} <${SMTP_EMAIL}>` : SMTP_EMAIL;
  return t.sendMail({
    from,
    to,
    subject,
    text,
    html
  });
}

module.exports = {
  sendMail,
  isConfigured
};

