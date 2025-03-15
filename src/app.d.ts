/** @format */

// src/app.d.ts
import type { User } from "$lib/types";

declare global {
  namespace App {
    interface Locals {
      user: User | null; // User can be null if not authenticated
    }
    // Add other interfaces (PageData, Error, etc.) if needed
  }
}

export {};
