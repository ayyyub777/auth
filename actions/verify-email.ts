"use server";

import { getUserByEmail } from "@/data/user";
import { getVerificationTokenByToken } from "@/data/verificiation-token";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";

export const verifyEmail = async (token: string) => {
  // Check if token exists
  const existingToken = await getVerificationTokenByToken(token);

  if (!existingToken) {
    return {
      error: {
        title: "Invalid token",
        description:
          "The provided verification token is invalid or has expired.",
      },
    };
  }

  // Check if token has expired
  const hasExpired = new Date(existingToken.expires) < new Date();

  if (hasExpired) {
    return {
      error: {
        title: "Token has expired",
        description:
          "The verification token has expired. Please request a new verification link.",
      },
    };
  }

  // Check if user exists
  const existingUser = await getUserByEmail(existingToken.email);

  if (!existingUser || !existingUser.email || !existingUser.password) {
    return {
      error: {
        title: "User not found",
        description: "No user associated with this email was found.",
      },
    };
  }

  // Update user's email verification status and email
  await prisma.user.update({
    where: { id: existingUser.id },
    data: {
      emailVerified: new Date(),
      email: existingToken.email,
    },
  });

  // Delete the verification token
  await prisma.verificationToken.delete({
    where: { id: existingToken.id },
  });

  // Redirect to the signin page
  redirect("/signin");
};
