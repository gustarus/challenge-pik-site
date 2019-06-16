<script>
  import uri from './../instances/uri';
  import { URI_PROPERTY } from './../constants';

  // getting query params
  const params = uri.parse(window.location.pathname, URI_PROPERTY); // TODO Extract this to rotue logic.
  const id = parseInt(params.id, 10);
  console.log(id);
</script>

<style>
	h1 {
		color: purple;
	}
</style>

<h1>Property page</h1>
