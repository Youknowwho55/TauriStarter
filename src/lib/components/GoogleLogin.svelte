<!-- @format -->
<!-- /src/lib/components/GoogleLogin.svelte -->

<script>
  import { initiateGoogleLogin, getUserInfo } from "$lib/auth/googleAuth";
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";

  // In your handleGoogleLogin function
  import { setUser } from "$lib/stores/auth";

  // Then in the function:
  const accessToken = await initiateGoogleLogin();
  if (accessToken) {
    const userData = await getUserInfo(accessToken);
    setUser(userData, accessToken);
    goto("/dashboard");
  }

  let user = null;
  let loading = false;
  let error = null;

  async function handleGoogleLogin() {
    try {
      loading = true;
      const token = await initiateGoogleLogin();
      user = await getUserInfo(token);

      // Store the token and user info
      localStorage.setItem("auth_token", token);
      localStorage.setItem("user", JSON.stringify(user));

      // Redirect to the dashboard or home page
      goto("/dashboard");
    } catch (err) {
      error = err.message;
    } finally {
      loading = false;
    }
  }

  onMount(() => {
    // Check if user is already logged in
    const token = localStorage.getItem("auth_token");
    const savedUser = localStorage.getItem("user");

    if (token && savedUser) {
      user = JSON.parse(savedUser);
      goto("/dashboard");
    }
  });
</script>

<div class="login-container">
  <h1>Login to Your App</h1>

  {#if loading}
    <p>Loading...</p>
  {:else if user}
    <p>Welcome, {user.name}!</p>
  {:else}
    <button on:click={handleGoogleLogin} disabled={loading}>
      Sign in with Google
    </button>

    {#if error}
      <p class="error">{error}</p>
    {/if}
  {/if}
</div>

<style>
  .login-container {
    max-width: 400px;
    margin: 0 auto;
    padding: 2rem;
    text-align: center;
  }

  button {
    background-color: #4285f4;
    color: white;
    padding: 0.8rem 1.5rem;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 1rem;
  }

  button:hover {
    background-color: #3367d6;
  }

  .error {
    color: red;
    margin-top: 1rem;
  }
</style>
