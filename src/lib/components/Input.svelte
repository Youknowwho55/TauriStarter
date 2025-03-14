<!-- @format -->
<script>
  export let value = "";
  export let placeholder = "";
  export let id = "";
  export let label = ""; // Keep this
  export let type = "text";
  export let disabled = false;
  export let required = false;

  export let errors;
  export let name; // Add the name prop
</script>
<div class="form-control mb-2 w-full max-w-lg">
  <!-- Render the label if provided -->
  {#if label}
    <label for={id} class="label pb-1 font-medium">
      <span class="label-text">{label}</span>
    </label>
  {/if}
  <input
    class={type === "file"
      ? "file-input file-input-bordered w-full max-w-lg"
      : "block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 outline-none focus:border-primary-500 focus:ring-primary-500 disabled:cursor-not-allowed disabled:opacity-50 rtl:text-right dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500"}
    {type}
    {placeholder}
    {required}
    {disabled}
    {id}
    name={name || id}
    {value}
  />
  {#if errors}
    {#each errors as error}
      <label for={id} class="label py-0 pt-1">
        <span class="label-text-alt text-error">
          {error}
        </span>
      </label>
    {/each}
  {/if}
</div>

<!-- Export as default -->
