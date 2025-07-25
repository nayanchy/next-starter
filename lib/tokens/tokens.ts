import { v4 as uuid } from "uuid";
import { getVerificationTokenByEmail } from "../services/verification.services";
import { db } from "../db";

export const generateVerificationToken = async (email: string) => {
  const token = uuid();

  const expires = new Date(new Date().getTime() + 1000 * 60 * 15);

  const existingToken = await getVerificationTokenByEmail(email);

  if (existingToken) {
    await db.verificationToken.delete({
      where: {
        id: existingToken.id,
      },
    });
  }

  const verificationToken = await db.verificationToken.create({
    data: {
      token,
      expires,
      email,
    },
  });

  return verificationToken;
};
