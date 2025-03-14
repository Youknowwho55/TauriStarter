/** @format */

// src/routes/auth/login/+server.js
import { redirect } from "@sveltejs/kit";
import { google } from "@auth/core/providers/google";

export const GET = async ({ url, locals }) => {
  const redirectUri = `${url.origin}/auth/callback`;
  const authorizationUrl = google.getAuthorizationUrl({
    redirect_uri: redirectUri,
    scope: "openid profile email",
    state: "some_random_state", // You should generate a random state for security
  });

  throw redirect(302, authorizationUrl);
};
