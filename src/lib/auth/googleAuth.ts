/** @format */
// src/lib/auth/googleAuth.ts

import { WebviewWindow } from "@tauri-apps/api/window";
import { listen } from "@tauri-apps/api/event";
import { createUser, findUserByEmail } from "$lib/auth/db";
import { createSession } from "$lib/auth/session";
import { generateSessionToken } from "$lib/auth/session"; // Assuming you have this function

const CLIENT_ID = import.meta.env.VITE_CLIENT_ID;
const REDIRECT_URI = import.meta.env.VITE_REDIRECT_URI;

export async function initiateGoogleLogin() {
  // Construct the Google OAuth URL
  const authUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  authUrl.searchParams.append("client_id", CLIENT_ID);
  authUrl.searchParams.append("redirect_uri", REDIRECT_URI);
  authUrl.searchParams.append("response_type", "token");
  authUrl.searchParams.append("scope", "email profile");

  // Create an auth window
  const authWindow = new WebviewWindow("google-oauth", {
    url: authUrl.toString(),
    title: "Google Sign In",
    width: 800,
    height: 600,
    resizable: false,
  });

  // Listen for the redirect with the token
  return new Promise((resolve, reject) => {
    listen("tauri://protocol-uri", async (data) => {
      const url = new URL(data.payload);
      const hashParams = new URLSearchParams(url.hash.substring(1));
      const accessToken = hashParams.get("access_token");

      if (accessToken) {
        authWindow.close();

        try {
          // Fetch user info from Google
          const userInfo = await getUserInfo(accessToken);

          // Check if the user already exists in the database
          let user = await findUserByEmail(userInfo.email);

          if (!user) {
            // Create a new user if they don't exist
            user = await createUser({
              id: userInfo.id, // Use Google's user ID or generate your own
              name: userInfo.name,
              email: userInfo.email,
              avatar: userInfo.picture,
            });
          }

          // Create a session for the user
          const sessionToken = generateSessionToken(user);
          await createSession({
            id: crypto.randomUUID(), // Generate a unique session ID
            userId: user.id,
            token: sessionToken,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
          });

          resolve({ user, sessionToken });
        } catch (error) {
          console.error("Error during Google login:", error);
          reject(error);
        }
      } else {
        reject(new Error("No access token found"));
      }
    });
  });
}

export async function getUserInfo(accessToken) {
  const response = await fetch(
    "https://www.googleapis.com/oauth2/v2/userinfo",
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  return response.json();
}
