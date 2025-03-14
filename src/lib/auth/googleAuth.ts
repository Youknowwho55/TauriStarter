/** @format */
// src/lib/auth/googleAuth.ts

import { WebviewWindow } from "@tauri-apps/api/window";
import { listen } from "@tauri-apps/api/event";
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
  return new Promise((resolve) => {
    listen("tauri://protocol-uri", (data) => {
      const url = new URL(data.payload);
      const hashParams = new URLSearchParams(url.hash.substring(1));
      const accessToken = hashParams.get("access_token");

      if (accessToken) {
        authWindow.close();
        resolve(accessToken);
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
