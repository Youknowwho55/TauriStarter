<!-- @format -->
<!-- src/routes/+page.svelte (or any component file) -->
<script>
  import Todo from "../../lib/components/Todo.svelte";
</script>

<!-- src/routes/dashboard/+page.svelte -->
<script>
  async function logout() {
    await fetch("/auth/logout", { method: "POST" });
    window.location.href = "/login";
  }
</script>

<button on:click={logout}>Logout</button>

<Todo />
