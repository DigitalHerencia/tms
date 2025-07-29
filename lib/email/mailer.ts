import nodemailer from "nodemailer";

const host = process.env.SMTP_HOST;

export const transporter = host
  ? nodemailer.createTransport({
      host,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    })
  : null;

export async function sendInvitationEmail(to: string, link: string) {
  if (!transporter) {
    console.log("Email service not configured; skipping send");
    return;
  }
  await transporter.sendMail({
    from:
      process.env.SMTP_FROM || process.env.SMTP_USER || "no-reply@example.com",
    to,
    subject: "You're invited to FleetFusion",
    text: `You have been invited to join FleetFusion. Click the link to accept: ${link}`,
    html: `<p>You have been invited to join FleetFusion.</p><p><a href="${link}">Accept Invitation</a></p>`,
  });
}
