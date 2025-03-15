/** @format */

// src/lib/server/auth/session.ts
import type { Handle } from "@sveltejs/kit";
import { db } from "../auth/db"; // Correct path to local db.ts
import jwt from "jsonwebtoken";

// New decodeJwt function
export function decodeJwt(token: string): User | null {
  try {
    return jwt.verify(token, process.env.JWT_SECRET!) as User;
  } catch {
    return null;
  }
}
import type { User } from "$lib/types";

const SESSION_COOKIE_NAME = "session";

// Revised createSession using event context
export async function createSession(event: Handle, user: User): Promise<void> {
  const sessionToken = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, {
    expiresIn: "7d",
  });

  await db.session.create({
    data: {
      userId: user.id,
      token: sessionToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  });

  event.cookies.set(SESSION_COOKIE_NAME, sessionToken, {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 7 * 24 * 60 * 60,
  });
}

// Fixed getSessionUser with cookie access
export async function getSessionUser(event: Handle): Promise<User | null> {
  const sessionToken = event.cookies.get(SESSION_COOKIE_NAME);

  if (!sessionToken) {
    return null;
  }

  const decoded = decodeJwt(sessionToken);

  if (decoded) {
    // Add database validation here
    return decoded;
  }

  return null;
}
