<!-- @format -->
<script lang="ts">
  import { onMount } from "svelte";
  import {
    getTodosByUser,
    addTodo,
    updateTodo,
    deleteTodo,
  } from "$lib/services/todoDb";

  // Example: Get the current user ID (replace with your actual user ID logic)
  const userId = "user-123"; // Replace with the actual user ID from your session or auth system

  let todos: any[] = [];
  let loading = true;
  let error: string | null = null;
  let newTodoTitle = "";

  onMount(async () => {
    await fetchTodos();
  });

  async function fetchTodos() {
    try {
      loading = true;
      const result = await getTodosByUser(userId);
      todos = result;
    } catch (err) {
      error = "Failed to load todos";
      console.error(err);
    } finally {
      loading = false;
    }
  }

  async function handleAddTodo() {
    if (!newTodoTitle.trim()) return;

    try {
      const newTodo = {
        id: crypto.randomUUID(), // Generate a unique ID
        title: newTodoTitle,
        status: "pending",
        userId,
      };

      await addTodo(newTodo);
      await fetchTodos(); // Refresh the todo list
      newTodoTitle = ""; // Clear the input
    } catch (err) {
      error = "Failed to add todo";
      console.error(err);
    }
  }

  async function handleUpdateTodo(id: string, status: string) {
    try {
      await updateTodo({ id, status });
      await fetchTodos(); // Refresh the todo list
    } catch (err) {
      error = "Failed to update todo";
      console.error(err);
    }
  }

  async function handleDeleteTodo(id: string) {
    try {
      await deleteTodo(id);
      await fetchTodos(); // Refresh the todo list
    } catch (err) {
      error = "Failed to delete todo";
      console.error(err);
    }
  }
</script>

{#if loading}
  <p>Loading todos...</p>
{:else if error}
  <p class="error">{error}</p>
{:else}
  <div class="todo-container">
    <!-- Add Todo Form -->
    <div class="add-todo">
      <input
        type="text"
        bind:value={newTodoTitle}
        placeholder="Add a new todo"
      />
      <button on:click={handleAddTodo}>Add</button>
    </div>

    <!-- Todo List -->
    <ul class="todo-list">
      {#each todos as todo (todo.id)}
        <li class="todo-item">
          <input
            type="checkbox"
            checked={todo.status === "completed"}
            on:change={() =>
              handleUpdateTodo(
                todo.id,
                todo.status === "completed" ? "pending" : "completed"
              )}
          />
          <span class:completed={todo.status === "completed"}>
            {todo.title}
          </span>
          <button on:click={() => handleDeleteTodo(todo.id)}>Delete</button>
        </li>
      {/each}
    </ul>
  </div>
{/if}
