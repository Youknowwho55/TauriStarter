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
    // Define database file path - you can also use relative path like "sqlite:todos.db"
    // Using app data directory ensures proper permissions and location
    const dbPath = `sqlite:${appDataDirPath}/todos.db`;

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

// Example function to add a todo
export async function addTodo(todo: {
  id: string;
  title: string;
  status: string;
}) {
  try {
    const db = await connectToDatabase();
    // Change $1, $2, $3 to ?, ?, ? for SQLite
    return await db.execute(
      "INSERT INTO todos (id, title, status) VALUES (?, ?, ?) RETURNING *",
      [todo.id, todo.title, todo.status]
    );
  } catch (error) {
    console.error("Error adding todo:", error);
    throw error;
  }
}

// Example function to update a todo
export async function updateTodo(todo: {
  id: string;
  title: string;
  status: string;
}) {
  try {
    const db = await connectToDatabase();
    // Change $1, $2, $3 to ?, ?, ? for SQLite
    return await db.execute(
      "UPDATE todos SET title = ?, status = ? WHERE id = ?",
      [todo.title, todo.status, todo.id]
    );
  } catch (error) {
    console.error("Error updating todo:", error);
    throw error;
  }
}

// Get all todos
export async function getAllTodos() {
  try {
    const db = await connectToDatabase();
    return await db.select("SELECT * FROM todos ORDER BY id");
  } catch (error) {
    console.error("Error fetching todos:", error);
    throw error;
  }
}

// Delete a todo
export async function deleteTodo(id: string) {
  try {
    const db = await connectToDatabase();
    // Change $1 to ? for SQLite
    return await db.execute("DELETE FROM todos WHERE id = ?", [id]);
  } catch (error) {
    console.error("Error deleting todo:", error);
    throw error;
  }
}

// Initialize database and create tables
export async function initializeDatabase() {
  const db = await connectToDatabase();

  // Create todos table if it doesn't exist
  // SQLite syntax is slightly different than PostgreSQL
  await db.execute(`
    CREATE TABLE IF NOT EXISTS todos (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      status TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  console.log("Database initialized successfully");
}
