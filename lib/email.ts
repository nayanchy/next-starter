import { EmailConfig, EmailResult, EmailTemplate } from "@/types/email";
import nodemailer, { Transporter } from "nodemailer";

// Creating transporter with Zoho SMTP configuration
export const createTransporter = (): Transporter => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || "587"),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    tls: {
      ciphers: "SSLv3",
      rejectUnauthorized: false,
    },
  });
};

// Email sending function
export const sendMail = async (config: EmailConfig): Promise<EmailResult> => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: process.env.SMTP_USER,
      to: config.to,
      subject: config.subject,
      text: config.text,
      html: config.html,
    };

    const info = await transporter.sendMail(mailOptions);

    console.log("Message sent: %s", info.messageId);

    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Error sending email:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return { success: false, error: errorMessage };
  }
};

// Email Templates

export const emailTemplates = {
  welcome: (name: string) => ({
    subject: "Welcome to NextJs FullStack Auth",
    text: `Hello ${name}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #333;">Welcome ${name}!</h1>
        <p>Thank you for joining our platform. We're excited to have you on board!</p>
        <p>Best regards,<br>The Team</p>
      </div>
    `,
  }),

  verification: (name: string, url: string) => ({
    subject: "Email Verification",
    text: `Hello ${name},\n\nPlease verify your email by clicking the link below:\n${url}`,
    html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #333;">Email Verification</h1>
          <p>Hello ${name},</p>
          <p>Please verify your email by clicking the link below:</p>
          <a href="${url}">${url}</a>
          <p>Best regards,<br>The Team</p>
        </div>
      `,
  }),
};
