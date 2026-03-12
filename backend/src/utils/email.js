import nodemailer from 'nodemailer';

// Configure transporter from environment.
// Works with any SMTP provider (Gmail, SendGrid SMTP, etc.).
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendVerificationEmail(to, username, code) {
  if (!to) return;
  const from = process.env.FROM_EMAIL || process.env.SMTP_USER;
  const subject = 'Stock Management System – verification code';
  const text = `Hello ${username},

Here is your verification code for the Stock Management System:

  ${code}

Enter this code in the app to activate your account.

If you did not request this, you can ignore this email.`;

  await transporter.sendMail({ from, to, subject, text });
}

export async function sendResetEmail(to, username, code) {
  if (!to) return;
  const from = process.env.FROM_EMAIL || process.env.SMTP_USER;
  const subject = 'Stock Management System – password reset code';
  const text = `Hello ${username},

You requested to reset your password.

Your password reset code is:

  ${code}

Enter this code in the app to set a new password.

If you did not request this, please contact the system administrator.`;

  await transporter.sendMail({ from, to, subject, text });
}

