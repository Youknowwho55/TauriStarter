<!-- @format -->
<!-- /src/routes/auth/callback/+page.svelte -->

<script>
  import { onMount } from "svelte";

  onMount(() => {
    // This page will be loaded in the system browser after OAuth
    // The redirect to custom protocol will happen automatically
    // This is just a fallback in case the redirect doesn't work
    window.close();
  });
</script>

<div class="callback-container">
  <h2>Authentication Complete</h2>
  <p>You can close this window and return to the application.</p>
</div>
