// Email client for Edge Runtime (NextAuth config)
export const sendEmailViaAPI = async (emailData: {
  type: "welcome" | "verification";
  name: string;
  email: string;
  url?: string;
}) => {
  try {
    // Use absolute URL for API calls from Edge Runtime
    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";

    const response = await fetch(`${baseUrl}/api/send-email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(emailData),
    });

    const result = await response.json();

    if (!response.ok) {
      console.error("Failed to send email:", result);
      return { success: false, error: result.error };
    }

    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error("Error calling email API:", error);
    return { success: false, error: "Failed to send email" };
  }
};

// Helper function specifically for verification emails
export const sendVerificationEmailViaAPI = async (
  name: string,
  email: string,
  token: string
) => {
  const verificationUrl = `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/auth/verify?token=${token}`;

  return await sendEmailViaAPI({
    type: "verification",
    name,
    email,
    url: verificationUrl,
  });
};

// Helper function for welcome emails
export const sendWelcomeEmailViaAPI = async (name: string, email: string) => {
  return await sendEmailViaAPI({
    type: "welcome",
    name,
    email,
  });
};

// // Helper function for password reset emails
// export const sendPasswordResetEmailViaAPI = async (
//   name: string,
//   email: string,
//   token: string
// ) => {
//   const resetUrl = `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/auth/reset-password?token=${token}`;

//   return await sendEmailViaAPI({
//     type: "passwordReset",
//     name,
//     email,
//     url: resetUrl,
//   });
// };
