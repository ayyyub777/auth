"use server";

import { getVerificationTokenByEmail } from "@/data/verificiation-token";
import prisma from "@/lib/prisma";
import { sendVerificationEmail } from "@/lib/mail";
import { v4 as uuidv4 } from "uuid";

// Constants
const TOKEN_EXPIRATION_TIME = 3600 * 1000; // 1 hour in milliseconds

export const sendVerificationToken = async (email: string) => {
  // Generate token and expiration date
  const token = uuidv4();
  const expires = new Date(Date.now() + TOKEN_EXPIRATION_TIME);

  // Delete existing token if any
  const existingToken = await getVerificationTokenByEmail(email);

  if (existingToken) {
    await prisma.verificationToken.delete({
      where: { id: existingToken.id },
    });
  }

  // Create new verification token
  const verificationToken = await prisma.verificationToken.create({
    data: {
      email,
      token,
      expires,
    },
  });

  // Send verification email
  await sendVerificationEmail(verificationToken.email, verificationToken.token);

  return {
    success: {
      title: "Check youe email",
      description: "We sent you instructions to confirm your email.",
    },
  };
};
