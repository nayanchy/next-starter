"use server";

import { loginSchema } from "@/schemas";
import z from "zod";
import { signIn } from "@/auth";
import { AuthError } from "next-auth";
import { CustomAuthError } from "../errors/auth.error";

export interface LoginResponse {
  success?: boolean;
  error?: boolean;
  message?: string;
}

export const login = async (
  values: z.infer<typeof loginSchema>
): Promise<LoginResponse> => {
  const validatedFields = loginSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: true, message: "Invalid fields" };
  }

  const { email, password } = validatedFields.data;

  try {
    await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
  } catch (err) {
    if (err instanceof AuthError) {
      const customError = err as CustomAuthError;
      switch (err.type) {
        case "CallbackRouteError":
          return { error: true, message: err.cause?.err?.message };
        case "CredentialsSignin":
          return { error: true, message: customError.message };
        default:
          return { error: true, message: "An unknown error occurred." };
      }
    }
    throw err;
  }

  return { success: true, message: "Login successful" };
};
