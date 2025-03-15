/** @format */
// src/lib/services/db.ts
import Database from "@tauri-apps/plugin-sql";
import { appDataDir } from "@tauri-apps/api/path";

// Use a singleton pattern to avoid multiple connections
let db: any = null;

// Connect to SQLite database
export async function connectToDatabase() {
  if (db) return db;

  try {
    // Get app data directory for storing the database
    const appDataDirPath = await appDataDir();
    // Define database file path
    const dbPath = `sqlite:${appDataDirPath}/app.db`;

    // For development, you might want to log the database location
    console.log(`Using database at: ${dbPath}`);

    db = await Database.load(dbPath);
    console.log("Database connected successfully");
    return db;
  } catch (error) {
    console.error("Database connection failed:", error);
    throw error;
  }
}

// Initialize database and create tables
export async function initializeDatabase() {
  const db = await connectToDatabase();

  // Create users table if it doesn't exist
  await db.execute(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      avatar TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Create sessions table if it doesn't exist
  await db.execute(`
    CREATE TABLE IF NOT EXISTS sessions (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      token TEXT NOT NULL UNIQUE,
      expires_at TIMESTAMP NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
    )
  `);

  // Create todos table if it doesn't exist
  await db.execute(`
    CREATE TABLE IF NOT EXISTS todos (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      status TEXT NOT NULL,
      user_id TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
    )
  `);

  console.log("Database initialized successfully");
}

// User-related functions

/**
 * Create a new user
 */
export async function createUser(user: {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}) {
  try {
    const db = await connectToDatabase();
    return await db.execute(
      "INSERT INTO users (id, name, email, avatar) VALUES (?, ?, ?, ?)",
      [user.id, user.name, user.email, user.avatar]
    );
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
}

/**
 * Find a user by email
 */
export async function findUserByEmail(email: string) {
  try {
    const db = await connectToDatabase();
    const result = await db.select("SELECT * FROM users WHERE email = ?", [
      email,
    ]);
    return result[0] || null;
  } catch (error) {
    console.error("Error finding user by email:", error);
    throw error;
  }
}

/**
 * Find a user by ID
 */
export async function findUserById(id: string) {
  try {
    const db = await connectToDatabase();
    const result = await db.select("SELECT * FROM users WHERE id = ?", [id]);
    return result[0] || null;
  } catch (error) {
    console.error("Error finding user by ID:", error);
    throw error;
  }
}

/**
 * Update a user's profile
 */
export async function updateUserProfile(
  id: string,
  updates: { name?: string; email?: string; avatar?: string }
) {
  try {
    const db = await connectToDatabase();
    const fields = Object.keys(updates)
      .map((key) => `${key} = ?`)
      .join(", ");
    const values = Object.values(updates);
    values.push(id); // Add the user ID for the WHERE clause

    return await db.execute(`UPDATE users SET ${fields} WHERE id = ?`, values);
  } catch (error) {
    console.error("Error updating user profile:", error);
    throw error;
  }
}

// Session-related functions

/**
 * Create a new session
 */
export async function createSession(session: {
  id: string;
  userId: string;
  token: string;
  expiresAt: Date;
}) {
  try {
    const db = await connectToDatabase();
    return await db.execute(
      "INSERT INTO sessions (id, user_id, token, expires_at) VALUES (?, ?, ?, ?)",
      [
        session.id,
        session.userId,
        session.token,
        session.expiresAt.toISOString(),
      ]
    );
  } catch (error) {
    console.error("Error creating session:", error);
    throw error;
  }
}

/**
 * Find a session by token
 */
export async function findSessionByToken(token: string) {
  try {
    const db = await connectToDatabase();
    const result = await db.select("SELECT * FROM sessions WHERE token = ?", [
      token,
    ]);
    return result[0] || null;
  } catch (error) {
    console.error("Error finding session by token:", error);
    throw error;
  }
}

/**
 * Delete a session by token
 */
export async function deleteSession(token: string) {
  try {
    const db = await connectToDatabase();
    return await db.execute("DELETE FROM sessions WHERE token = ?", [token]);
  } catch (error) {
    console.error("Error deleting session:", error);
    throw error;
  }
}
