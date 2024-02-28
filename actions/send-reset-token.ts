"use server";

import { EmailSchema } from "@/schemas";
import { getPasswordResetTokenByEmail } from "@/data/password-reset-token";
import { getUserByEmail } from "@/data/user";
import prisma from "@/lib/prisma";
import { sendPasswordResetEmail } from "@/lib/mail";
import { v4 as uuidv4 } from "uuid";

// Constants
const TOKEN_EXPIRATION_TIME = 3600 * 1000; // 1 hour in milliseconds

export const sendResetToken = async ({ email }: { email: string }) => {
  // Validate email
  const validatedFields = EmailSchema.safeParse({ email });

  if (!validatedFields.success) {
    return {
      error: {
        title: "Invalid email format",
        description:
          "The email provided does not have a valid format. Please ensure it follows the standard email format (e.g., example@domain.com).",
      },
    };
  }

  // Check if user exists
  const existingUser = await getUserByEmail(email);

  if (!existingUser) {
    return {
      error: {
        title: "User with this email not found",
        description:
          "No user account associated with this email was found. Please verify the email address or register for a new account.",
      },
    };
  }

  // Generate token
  const token = uuidv4();
  const expires = new Date(Date.now() + TOKEN_EXPIRATION_TIME);

  // Delete existing token if any
  const existingToken = await getPasswordResetTokenByEmail(email);

  if (existingToken) {
    await prisma.passwordResetToken.delete({
      where: { id: existingToken.id },
    });
  }

  // Create new password reset token
  const passwordResetToken = await prisma.passwordResetToken.create({
    data: {
      email,
      token,
      expires,
    },
  });

  // Send password reset email
  await sendPasswordResetEmail(
    passwordResetToken.email,
    passwordResetToken.token
  );

  return {
    success: {
      title: "Check youe email",
      description: "We sent you instructions to reset your password.",
    },
  };
};
