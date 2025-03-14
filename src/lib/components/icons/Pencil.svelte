<!-- @format -->
<!-- Pencil.svelte -->
<script>
  export let width = 24;
  export let height = 24;
  export let strokeColor = "currentColor";
</script>
<svg xmlns="http://www.w3.org/2000/svg" {width} {height} viewBox="0 0 24 24">
  <path
    fill="none"
    stroke={strokeColor}
    stroke-linecap="round"
    stroke-linejoin="round"
    stroke-width="2"
    d="M4 20h4L18.5 9.5a2.828 2.828 0 1 0-4-4L4 16zm9.5-13.5l4 4"
  />
</svg>
