<!-- @format -->
<!-- src/routes/profiles/+page.svelte -->
<script>
  export let data;

  let user = data.user;
  let success = false;
  let errors = {};

  async function updateProfile(event) {
    const formData = new FormData(event.target);

    const response = await fetch("/profiles", {
      method: "POST",
      body: formData,
    });

    const result = await response.json();

    if (result.success) {
      success = true;
    } else {
      errors = result.errors;
    }
  }
</script>
{#if user}
  <h1>Welcome, {user.name}!</h1>

  <form on:submit|preventDefault={updateProfile}>
    <label for="name">Name</label>
    <input type="text" id="name" name="name" value={user.name} />

    <label for="email">Email</label>
    <input type="email" id="email" name="email" value={user.email} />

    <button type="submit">Update Profile</button>
  </form>

  {#if success}
    <p>Profile updated successfully!</p>
  {/if}

  {#if Object.keys(errors).length > 0}
    <ul>
      {#each Object.entries(errors) as [field, message]}
        <li>{field}: {message}</li>
      {/each}
    </ul>
  {/if}
{:else}
  <p>Please <a href="/login">log in</a> to view your profile.</p>
{/if}
