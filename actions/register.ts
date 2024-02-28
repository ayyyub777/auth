"use server";

import * as z from "zod";

import { RegisterSchema } from "@/schemas";
import bcrypt from "bcryptjs";
import { getUserByEmail } from "@/data/user";
import prisma from "@/lib/prisma";
import { sendVerificationToken } from "./send-verification-token";

export const register = async (values: z.infer<typeof RegisterSchema>) => {
  // Validate registration fields
  const validatedFields = RegisterSchema.safeParse(values);

  if (!validatedFields.success) {
    return {
      error: {
        title: "Invalid fields",
        description:
          "The provided fields did not pass validation. Please review and correct any errors.",
      },
    };
  }

  const { email, password, name } = validatedFields.data;

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Check if email is already in use
  const existingUser = await getUserByEmail(email);

  if (existingUser) {
    return {
      error: {
        title: "Email already in use",
        description:
          "The email address provided is already associated with an existing account. Please use a different email address or try logging in.",
      },
    };
  }

  // Create new user
  await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });

  // Send verification token
  const verify = await sendVerificationToken(email);
  return verify;
};
