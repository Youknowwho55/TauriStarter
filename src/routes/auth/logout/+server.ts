/** @format */

// src/routes/auth/logout/+server.ts
import { redirect } from "@sveltejs/kit";
import { deleteSession } from "$lib/server/auth/session";

export const POST = async ({ cookies }) => {
  await deleteSession(cookies);

  throw redirect(303, "/login");
};
