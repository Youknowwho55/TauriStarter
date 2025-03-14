<!-- @format -->
<script lang="ts">
  import { event } from "@tauri-apps/api";

  let username = "";
  let email = "";

  async function addUser() {
    try {
      await event("add_user", { username, email });
      console.log("User added successfully");
    } catch (error) {
      console.error("Failed to add user:", error);
    }
  }
</script>

<main>
  <h1>Add a New User</h1>
  <form on:submit|preventDefault={addUser}>
    <input type="text" bind:value={username} placeholder="Username" required />
    <input type="email" bind:value={email} placeholder="Email" required />
    <button type="submit">Add User</button>
  </form>
</main>
