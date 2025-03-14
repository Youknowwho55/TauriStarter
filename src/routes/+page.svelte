<!-- @format -->
<script lang="ts">
  import Card from "$lib/components/Card.svelte";
  import { invoke } from "@tauri-apps/api/core";

  let name = $state(""); // For storing name
  let greetMsg = $state(""); // For storing greeting message
  let number = $state(0); // Initialize number as 0 (for counting)
  let countmsg = $state(""); // For storing the count message

  async function greet(event: Event) {
    event.preventDefault();
    // Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
    greetMsg = await invoke("greet", { name });
  }

  async function counter(event: Event) {
    event.preventDefault();
    // Increment the count value by 1
    number += 1;
    // Update the count message with the new count
    countmsg = `Count is now: ${number}`;
    // Optionally, you could invoke a backend function to keep track of counts
    // countmsg = await invoke("count", { number });
  }
</script>

<main class="container">
  <h1>Welcome to Tauri + Svelte</h1>

  <!-- Greet form -->
  <form class="row" onsubmit={greet}>
    <input id="greet-input" placeholder="Enter a name..." bind:value={name} />
    <button
      class="bg-amber-500 text-white py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-amber-300"
      type="submit">Greet</button
    >
  </form>
  <p>{greetMsg}</p>

  <!-- Count form -->
  <form class="row" onsubmit={counter}>
    <button
      class="bg-green-500 text-white py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-green-300"
      type="submit"
    >
      Increase Count
    </button>
  </form>
  <p>{countmsg}</p>

  <div>
    <Card />
  </div>
</main>
