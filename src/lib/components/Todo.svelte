<!-- @format -->
<!-- Example Todo.svelte component -->
<script lang="ts">
  import { onMount } from "svelte";
  import {
    getAllTodos,
    addTodo,
    updateTodo,
    deleteTodo,
  } from "$lib/services/db.ts";

  let todos: any[] = [];
  let loading = true;
  let error: string | null = null;

  onMount(async () => {
    try {
      loading = true;
      const result = await getAllTodos();
      todos = result;
    } catch (err) {
      error = "Failed to load todos";
      console.error(err);
    } finally {
      loading = false;
    }
  });

  //   async function handleAddTodo(event) {
  //     // Implementation...
  //   }
</script>

{#if loading}
  <p>Loading todos...</p>
{:else if error}
  <p class="error">{error}</p>
{:else}
  <!-- Todo list UI -->
{/if}
