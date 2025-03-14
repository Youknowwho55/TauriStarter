/** @format */

// src/routes/auth/callback/+server.js
import { redirect } from "@sveltejs/kit";
import { google } from "@auth/core/providers/google";

export const GET = async ({ url, locals }) => {
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");

  if (!code || !state) {
    throw new Error("Invalid callback");
  }

  const tokens = await google.getTokens({
    code,
    redirect_uri: process.env.GOOGLE_REDIRECT_URI,
    client_id: process.env.GOOGLE_CLIENT_ID,
    client_secret: process.env.GOOGLE_CLIENT_SECRET,
  });

  // Here you would typically create or update the user in your database
  // and set a session or cookie.

  throw redirect(303, "/dashboard"); // Redirect to a protected page
};
