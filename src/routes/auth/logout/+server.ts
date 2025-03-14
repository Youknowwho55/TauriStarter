/** @format */

// src/routes/auth/logout/+server.js
import { redirect } from "@sveltejs/kit";

export const POST = async ({ locals }) => {
  // Clear the user session
  locals.user = undefined;

  throw redirect(303, "/login");
};
