"use server";

import { registerSchema } from "@/schemas";
import z from "zod";
import * as bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { getUserByEmail } from "@/lib/services/user.services";

export interface LoginResponse {
  success?: boolean;
  error?: boolean;
  message?: string;
}

export const register = async (
  values: z.infer<typeof registerSchema>
): Promise<LoginResponse> => {
  const validatedFields = registerSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: true, message: "Invalid fields" };
  }

  const { name, email, password } = validatedFields.data;
  const hashedPassword = await bcrypt.hash(password, 12);
  const existingUser = await getUserByEmail(email);

  if (existingUser) {
    return {
      error: true,
      message: "User with this email already exists",
    };
  }

  await db.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      accounts: {
        create: {
          provider: "credentials",
          providerAccountId: email,
          type: "credentials",
        },
      },
    },
  });

  // TODO: Send verification token email

  return { success: true, message: "Registration successful" };
};
