import nodemailer from 'nodemailer';

let transporter = null;

function getTransporter() {
  if (transporter) return transporter;
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  if (!host || !user || !pass) {
    console.warn('Email service: SMTP not configured (SMTP_HOST, SMTP_USER, SMTP_PASS). Emails will be skipped.');
    return null;
  }
  transporter = nodemailer.createTransport({
    host: host || 'smtp.gmail.com',
    port: parseInt(port, 10) || 587,
    secure: process.env.SMTP_SECURE === 'true',
    auth: { user, pass },
  });
  return transporter;
}

const FROM_EMAIL = process.env.FROM_EMAIL || process.env.SMTP_USER || 'noreply@union.local';

/**
 * Send an email. Returns true if sent, false if skipped (no config or error).
 */
export async function sendEmail({ to, subject, text, html }) {
  const trans = getTransporter();
  if (!trans) return false;
  try {
    await trans.sendMail({
      from: FROM_EMAIL,
      to: Array.isArray(to) ? to.join(', ') : to,
      subject,
      text: text || (html ? html.replace(/<[^>]*>/g, '') : ''),
      html: html || undefined,
    });
    return true;
  } catch (err) {
    console.error('Email send error:', err.message);
    return false;
  }
}

/**
 * Send "monthly dues generated" notification to resident(s).
 */
export async function sendDuesGeneratedEmail({ toEmails, unitNumber, societyName, month, year, amount, dueDate }) {
  const monthName = new Date(year, month - 1, 1).toLocaleString('default', { month: 'long' });
  const subject = `Maintenance dues for ${monthName} ${year} – ${societyName || 'Union'}`;
  const text = `Your maintenance dues for ${monthName} ${year} have been generated.\n\nUnit: ${unitNumber}\nAmount: PKR ${amount}\nDue date: ${dueDate}\n\nPlease pay on time.`;
  const html = `
    <p>Your maintenance dues for <strong>${monthName} ${year}</strong> have been generated.</p>
    <p><strong>Unit:</strong> ${unitNumber}<br/>
    <strong>Amount:</strong> PKR ${amount}<br/>
    <strong>Due date:</strong> ${dueDate}</p>
    <p>Please pay on time.</p>
  `;
  if (!toEmails || toEmails.length === 0) return false;
  return sendEmail({ to: toEmails, subject, text, html });
}

/**
 * Send "reminder: pending dues" notification.
 */
export async function sendPendingDuesReminderEmail({ toEmails, unitNumber, societyName, amount, dueDate }) {
  const subject = `Reminder: Pending maintenance dues – ${societyName || 'Union'}`;
  const text = `Reminder: You have pending maintenance dues.\n\nUnit: ${unitNumber}\nAmount: PKR ${amount}\nDue date: ${dueDate}\n\nPlease pay at your earliest.`;
  const html = `
    <p>Reminder: You have <strong>pending maintenance dues</strong>.</p>
    <p><strong>Unit:</strong> ${unitNumber}<br/>
    <strong>Amount:</strong> PKR ${amount}<br/>
    <strong>Due date:</strong> ${dueDate}</p>
    <p>Please pay at your earliest.</p>
  `;
  if (!toEmails || toEmails.length === 0) return false;
  return sendEmail({ to: toEmails, subject, text, html });
}

/**
 * Notify union admin(s) when a resident submits a new complaint.
 */
export async function sendNewComplaintNotificationToAdmin({ toEmails, residentName, complaintTitle, complaintId, societyName }) {
  if (!toEmails || toEmails.length === 0) return false;
  const subject = `New complaint submitted – ${societyName || 'Union'}`;
  const text = `A resident has submitted a new complaint.\n\nResident: ${residentName}\nTitle: ${complaintTitle}\n\nPlease check the admin panel to view and respond.`;
  const html = `
    <p>A resident has submitted a <strong>new complaint</strong>.</p>
    <p><strong>Resident:</strong> ${residentName}<br/>
    <strong>Title:</strong> ${complaintTitle}</p>
    <p>Please check the admin panel to view and respond.</p>
  `;
  return sendEmail({ to: toEmails, subject, text, html });
}
