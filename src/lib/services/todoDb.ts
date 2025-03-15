/** @format */

// src/lib/services/todoDb.ts
import { connectToDatabase } from "../auth/db";

/**
 * Add a new todo
 */
export async function addTodo(todo: {
  id: string;
  title: string;
  status: string;
  userId: string; // Associate the todo with a user
}) {
  try {
    const db = await connectToDatabase();
    return await db.execute(
      "INSERT INTO todos (id, title, status, user_id) VALUES (?, ?, ?, ?)",
      [todo.id, todo.title, todo.status, todo.userId]
    );
  } catch (error) {
    console.error("Error adding todo:", error);
    throw error;
  }
}

/**
 * Update a todo
 */
export async function updateTodo(todo: {
  id: string;
  title?: string;
  status?: string;
}) {
  try {
    const db = await connectToDatabase();
    const fields = [];
    const values = [];

    if (todo.title) {
      fields.push("title = ?");
      values.push(todo.title);
    }
    if (todo.status) {
      fields.push("status = ?");
      values.push(todo.status);
    }

    values.push(todo.id); // Add the todo ID for the WHERE clause

    return await db.execute(
      `UPDATE todos SET ${fields.join(", ")} WHERE id = ?`,
      values
    );
  } catch (error) {
    console.error("Error updating todo:", error);
    throw error;
  }
}

/**
 * Get all todos for a user
 */
export async function getTodosByUser(userId: string) {
  try {
    const db = await connectToDatabase();
    return await db.select(
      "SELECT * FROM todos WHERE user_id = ? ORDER BY created_at DESC",
      [userId]
    );
  } catch (error) {
    console.error("Error fetching todos:", error);
    throw error;
  }
}

/**
 * Delete a todo
 */
export async function deleteTodo(id: string) {
  try {
    const db = await connectToDatabase();
    return await db.execute("DELETE FROM todos WHERE id = ?", [id]);
  } catch (error) {
    console.error("Error deleting todo:", error);
    throw error;
  }
}
