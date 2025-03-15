/** @format */

// src/hooks.server.ts
import type { Handle } from "@sveltejs/kit";
import { decodeJwt } from "$lib/auth/session"; // Example function to decode a JWT
import type { User } from "$lib/types";

export const handle: Handle = async ({ event, resolve }) => {
  // Get the session token from cookies
  const sessionToken = event.cookies.get("session");

  if (sessionToken) {
    // Decode the session token to get the user
    const user = decodeJwt(sessionToken) as User | null;

    if (user) {
      // Attach the user to `locals`
      event.locals.user = user;
    } else {
      // Clear the session if the token is invalid
      event.locals.user = null;
      event.cookies.delete("session");
    }
  } else {
    event.locals.user = null;
  }

  return resolve(event);
};
