import { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { loginSchema } from "./schemas";
import { getUserByEmail } from "./lib/services/user.services";
import bcrypt from "bcryptjs";
import { CustomAuthError } from "./lib/errors/auth.error";
import Google from "next-auth/providers/google";
import Github from "next-auth/providers/github";

export default {
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "email", type: "email" },
        password: { label: "password", type: "password" },
      },
      async authorize(credentials) {
        const validatedFields = loginSchema.safeParse(credentials);
        if (!validatedFields.success) {
          throw new CustomAuthError(
            "INVALID_CREDENTIALS",
            "Invalid credentials"
          );
        } else {
          const { email, password } = validatedFields.data;
          const res = await getUserByEmail(email);
          if (!res) {
            throw new CustomAuthError("USER_NOT_FOUND", "User not found");
          }

          if (res) {
            if (!res.password) {
              throw new CustomAuthError(
                "NO_PASSWORD_PROVIDED",
                "You have to use social login"
              );
            }
          }

          if (res.password !== null) {
            const isPasswordValid = await bcrypt.compare(
              password,
              res.password
            );
            if (!isPasswordValid) {
              throw new CustomAuthError("INVALID_PASSWORD", "Invalid password");
            }
          }

          // if (!res.emailVerified) {
          //   throw new CustomAuthError(
          //     "EMAIL_NOT_VERIFIED",
          //     "Please verify your email"
          //   );
          // }
          return res;
        }
      },
    }),
    Google,
    Github,
  ],
} satisfies NextAuthConfig;
