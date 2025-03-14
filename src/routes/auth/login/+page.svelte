<!-- @format -->
<!-- src/routes/login/+page.svelte -->

<script lang="ts">
  import { initiateGoogleLogin, getUserInfo } from "$lib/auth/googleAuth";
  import { goto } from "$app/navigation";
  import image from "$lib/images/RLP-removebg-preview.png";

  let loading = false;

  // Define the trigger type
  type Trigger = {
    mode: "normal" | "success" | "info" | "warn" | "danger";
    message: string;
    lifetime?: number;
  };

  const messages = {
    success: "Login successful!",
    error: "Something went wrong with Google authentication",
    processing: "Processing your login...",
  };

  const notify = {
    success: (message: string) =>
      showNotification({ mode: "success", message }),
    danger: (message: string) => showNotification({ mode: "danger", message }),
    info: (message: string) => showNotification({ mode: "info", message }),
  };

  // Function to show notifications
  const showNotification = (trigger: Trigger) => {
    acts.add(trigger);
  };

  async function handleGoogleLogin() {
    try {
      loading = true;
      notify.info(messages.processing);

      // Get the access token from Google
      const accessToken = await initiateGoogleLogin();

      if (accessToken) {
        // Get user information
        const user = await getUserInfo(accessToken);

        // Store auth data
        localStorage.setItem("auth_token", accessToken);
        localStorage.setItem("user", JSON.stringify(user));

        notify.success(messages.success);

        // Redirect to dashboard
        goto("/dashboard");
      }
    } catch (err) {
      console.error("Google auth error:", err);
      notify.danger(err.message || messages.error);
    } finally {
      loading = false;
    }
  }
</script>

<div style="display: contents">
  <main class="w-full bg-gray-50 dark:bg-gray-900">
    <div
      class="pt:mt-0 mx-auto flex flex-col items-center justify-center px-6 pt-8 md:h-screen dark:bg-gray-900"
    >
      <a
        href="/"
        class="my-2 flex items-center justify-center pt-5 text-2xl font-semibold lg:mb-10 dark:text-white"
        ><img src={image} class="mr-4 h-11" alt="Logo" />
        <span>Rayburn LP</span></a
      >
      <div
        class="flex w-full max-w-xl flex-col divide-gray-200 rounded-lg border-gray-200 bg-white p-4 text-gray-500 shadow-md sm:p-6 dark:divide-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400"
      >
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
          Sign in to platform
        </h1>
        <div class="flex w-full flex-col items-center space-y-2 pt-4">
          <!-- Google Sign-In Button -->
          <button
            on:click={handleGoogleLogin}
            type="button"
            class="flex w-full items-center justify-center rounded-lg border border-gray-300 bg-white px-5 py-3 text-center text-base font-medium text-gray-700 hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:hover:border-gray-700 dark:hover:bg-gray-700 dark:focus:ring-gray-700"
            disabled={loading}
          >
            <!-- Google Logo SVG -->
            <svg class="mr-2 h-5 w-5" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M21.35 11.1h-9.17v2.73h6.51c-.33 3.81-3.5 5.44-6.5 5.44C8.36 19.27 5 16.25 5 12c0-4.1 3.2-7.27 7.2-7.27 3.09 0 4.9 1.97 4.9 1.97L19 4.72S16.56 2 12.1 2C6.42 2 2.03 6.8 2.03 12c0 5.05 4.13 10 10.22 10 5.35 0 9.25-3.67 9.25-9.09 0-1.15-.15-1.81-.15-1.81z"
              />
            </svg>
            {loading ? "Connecting..." : "Sign in with Google"}
          </button>

          {#if loading}
            <div class="mt-4 text-center text-sm">
              <p>A browser window will open for authentication.</p>
              <p>Please complete the process in your browser.</p>
            </div>
          {/if}
        </div>
      </div>
    </div>
  </main>
  <div
    id="svelte-announcer"
    aria-live="assertive"
    aria-atomic="true"
    style="position: absolute; left: 0px; top: 0px; clip: rect(0px, 0px, 0px, 0px); clip-path: inset(50%); overflow: hidden; white-space: nowrap; width: 1px; height: 1px;"
  >
    Dashboard - Sign in
  </div>
</div>
