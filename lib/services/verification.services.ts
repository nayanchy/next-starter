"use server";
import { db } from "@/lib/db";
import { getUserByEmail } from "./user.services";

export const getVerificationTokenByEmail = async (email: string) => {
  try {
    const verificationToken = await db.verificationToken.findFirst({
      where: {
        email,
      },
    });

    return verificationToken;
  } catch (error) {
    return null;
  }
};

export const getVerificationTokenByToken = async (token: string) => {
  try {
    const verificationToken = await db.verificationToken.findUnique({
      where: {
        token,
      },
    });

    console.log("Verification token:", verificationToken);
    return verificationToken;
  } catch (error) {
    return null;
  }
};

export const deleteVerificationToken = async (token: string) => {
  try {
    await db.verificationToken.delete({
      where: {
        token,
      },
    });
  } catch (error) {
    return null;
  }
};

export const checkIfUserVerified = async (token: string) => {
  try {
    const tokenData = await getVerificationTokenByToken(token);
    const user = await getUserByEmail(tokenData?.email as string);
    if (user?.emailVerified) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.log(error);
  }
};

export const checkIfTokenExpired = async (token: string) => {
  try {
    const tokenData = await getVerificationTokenByToken(token);

    if (tokenData?.expires! < new Date()) {
      return true;
    }
    return false;
  } catch (error) {}
};
