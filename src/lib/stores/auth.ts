/** @format */

import { writable, derived } from "svelte/store";

// Define user type
export interface User {
  id?: string;
  email?: string;
  name?: string;
  picture?: string;
}

// Create stores
export const user = writable<User | null>(null);
export const token = writable<string | null>(null);
export const isAuthenticated = derived(user, ($user) => $user !== null);

// Initialize from localStorage if available
if (typeof window !== "undefined") {
  const savedUser = localStorage.getItem("user");
  const savedToken = localStorage.getItem("auth_token");

  if (savedUser && savedToken) {
    user.set(JSON.parse(savedUser));
    token.set(savedToken);
  }
}

// Auth functions
export function setUser(userData: User, accessToken: string) {
  user.set(userData);
  token.set(accessToken);
  localStorage.setItem("user", JSON.stringify(userData));
  localStorage.setItem("auth_token", accessToken);
}

export function logout() {
  user.set(null);
  token.set(null);
  localStorage.removeItem("user");
  localStorage.removeItem("auth_token");
}

export function isTokenExpired(token: string): boolean {
  // Parse JWT and check expiration if needed
  // This is a simple implementation - you may need to enhance
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );

    const { exp } = JSON.parse(jsonPayload);
    return exp * 1000 < Date.now();
  } catch (e) {
    console.error("Error parsing JWT token", e);
    return true;
  }
}
