<!-- @format -->
<script lang="ts">
  let { children } = $props();
  import "../app.css";

  import { onMount } from "svelte";
  import { initializeDatabase } from "$lib/services/db.ts";
  import Breadcrumb from "$lib/components/Breadcrumb.svelte";

  onMount(async () => {
    await initializeDatabase().catch((err) =>
      console.error("Failed to initialize database:", err)
    );
  });

  let currentYear = new Date().getFullYear();
</script>

<!-- Main Layout -->
<div class="min-h-screen bg-gray-50 flex flex-col">
  <!-- Header Section -->
  <header class="bg-blue-600 text-white p-4 shadow-lg">
    <div class="max-w-7xl mx-auto flex justify-between items-center">
      <!-- Add navigation or logo here -->
      <Breadcrumb />

      <nav>
        <ul class="flex space-x-4">
          <li><a href="/" class="hover:text-blue-200">Home</a></li>
          <li><a href="/login" class="hover:text-blue-200">Login</a></li>
          <li>
            <a href="/dashboard" class="hover:text-blue-200">Dashboard</a>
          </li>
          <li>
            <a href="/profiles" class="hover:text-blue-200">Profile</a>
          </li>
        </ul>
      </nav>
    </div>
  </header>

  <!-- Main Content -->
  <main class="flex-1 py-8">
    <div class="max-w-7xl mx-auto px-4">
      {@render children()}
    </div>
  </main>

  <!-- Footer Section -->
  <footer class="bg-gray-800 text-white p-4">
    <div class="max-w-7xl mx-auto text-center">
      <p>© {currentYear} My Professional Website. All rights reserved.</p>
    </div>
  </footer>
</div>
