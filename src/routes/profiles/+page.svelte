<!-- @format -->
<!-- // src/routes/profiles/+page.svelte -->
<script>
  import { enhance, applyAction } from "$app/forms";
  import { invalidateAll } from "$app/navigation";
  import Input from "$lib/components/Input.svelte";
  import Pencil from "$lib/components/icons/Pencil.svelte";
  let loading;

  $: loading = false;
  const showPreview = (event) => {
    const target = event.target;
    const files = target.files;

    if (files.length > 0) {
      const src = URL.createObjectURL(files[0]);
      preview.src = src;
    }
  };

  const submitUpdateProfile = () => {
    loading = true;
    return async ({ result }) => {
      switch (result.type) {
        case "success":
          await invalidateAll();
          break;
        case "error":
          break;
        default:
          await applyAction(result);
      }
      loading = false;
    };
  };
</script>

<div class="flex flex-col w-full h-full">
  <form
    action="?/updateProfile"
    method="POST"
    class="flex flex-col space-y-2 w-full"
    enctype="multipart/form-data"
    use:enhance={submitUpdateProfile}
  >
    <h3 class="text-2xl font-medium">Update Profile</h3>
    <div class="form-control w-full max-w-lg">
      <label for="avatar" class="label font-medium pb-1">
        <span class="label-text">Profile Picture</span>
      </label>
      <label for="avatar" class="avatar w-32 rounded-full hover:cursor-pointer">
        <label
          for="avatar"
          class="absolute -bottom-0.5 -right-0.5 hover:cursor-pointer"
        >
          <span class="btn btn-circle btn-sm btn-secondary">
            <Pencil width="48" height="48" strokeColor="blue" />
          </span>
        </label>
        <div class="w-32 rounded-full"></div>
      </label>
    </div>
    <Input
      id="name"
      label="Name"
      value={form?.data?.name ?? data?.user?.name}
      disabled={loading}
      errors={form?.errors?.name}
    />
    <div class="w-full max-w-lg pt-3">
      <button
        class="btn btn-primary w-full max-w-lg"
        type="submit"
        disabled={loading}
      >
        Update Profile
      </button>
    </div>
  </form>
</div>
