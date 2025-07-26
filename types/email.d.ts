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

export type EmailRequestBody =
  | {
      type: "welcome";
      subject: string;
      name: string;
      email: string;
    }
  | {
      type: "verification";
      name: string;
      email: string;
      html: string;
    }
  | {
      type: "custom";
      to: string;
      subject: string;
      text?: string;
      html?: string;
    };

export interface EmailTemplate {
  subject: string;
  text: string;
  html: string;
}
