<script>
  import { navigate } from 'svelte-routing';

  export let path;

  if (window.location.path !== path) {
    console.log(`[ROUTER] Redirect to '${path}' triggered`);
    // window.location = path; // TODO Use navigate instead of location change, but be aware of redirect from default to login page when not logged.
    setTimeout(() => navigate(path));
  }
</script>
