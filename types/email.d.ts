export interface EmailConfig {
  to: string | string[];
  subject: string;
  text?: string;
  html?: string;
}

export interface EmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

export interface WelcomeEmailData {
  name: string;
  email: string;
}

export interface CustomEmailData {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}

// For now, only verification emails are supported
export type EmailRequestBody = {
  type: "verification";
  name: string;
  email: string;
  url: string;
};

// When you add more types later, uncomment and use this:
// export type EmailRequestBody = {
//   type: 'welcome';
//   name: string;
//   email: string;
// } | {
//   type: 'verification';
//   name: string;
//   email: string;
//   url: string;
// } | {
//   type: 'custom';
//   to: string;
//   subject: string;
//   text?: string;
//   html?: string;
// };

export interface EmailTemplate {
  subject: string;
  text: string;
  html: string;
}
