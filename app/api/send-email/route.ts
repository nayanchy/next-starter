import { NextRequest, NextResponse } from "next/server";
import { sendMail, emailTemplates } from "@/lib/email";
import { EmailConfig, EmailRequestBody } from "@/types/email";

export async function POST(request: NextRequest) {
  try {
    const body: EmailRequestBody = await request.json();
    console.log("BODY:", body);
    const { type, ...data } = body;

    let emailData: EmailConfig;

    switch (type) {
      //   case "welcome":
      //     if ("email" in data && "name" in data) {
      //       emailData = {
      //         to: data.email,
      //         ...emailTemplates.welcome(data.name),
      //       };
      //     } else {
      //       throw new Error("Invalid email data");
      //     }

      //     break;

      case "verification":
        emailData = {
          to: data.email,
          ...emailTemplates.verification(data.name, data.url),
        };

        break;

      //   case "custom":
      //     if ("to" in data && "subject" in data) {
      //       emailData = {
      //         to: data.to,
      //         subject: data.subject,
      //         text: data.text,
      //         html: data.html,
      //       };
      //     } else {
      //       throw new Error("Invalid data for custom email");
      //     }

      //     break;

      default:
        return NextResponse.json(
          { error: "Invalid email type" },
          { status: 400 }
        );
    }

    const result = await sendMail(emailData);

    if (result.success) {
      return NextResponse.json(
        { message: "Email sent successfully", messageId: result.messageId },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { error: "Failed to send email", details: result.error },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
