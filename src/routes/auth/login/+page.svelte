<!-- @format -->
<script>
  import { initiateGoogleLogin } from "$lib/auth/googleAuth";
  import { session } from "$app/stores";

  async function handleGoogleLogin() {
    try {
      const { user, sessionToken } = await initiateGoogleLogin();

      // Save the session token to a cookie or local storage
      document.cookie = `session=${sessionToken}; path=/; max-age=${7 * 24 * 60 * 60}`;

      // Update the SvelteKit session store
      $session.user = user;

      // Redirect to the dashboard or home page
      window.location.href = "/dashboard";
    } catch (error) {
      console.error("Login failed:", error);
      alert("Login failed. Please try again.");
    }
  }
</script>
<h1>Login</h1>

<button on:click={handleGoogleLogin}>Login with Google</button>
