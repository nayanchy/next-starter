"use server";

import { db } from "../db";
import { getUserByEmail } from "./user.services";

export const verifyEmail = async (email: string) => {
  const user = await getUserByEmail(email);
  if (user) {
    await db.user.update({
      where: { id: user.id },
      data: { emailVerified: new Date() },
    });
  }

  return user;
};
