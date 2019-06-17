<script>
  import uri from './../../instances/uri';
  import { navigate } from 'svelte-routing';
  import { URI_PROPERTY_DELETE, URI_PROPERTY_INDEX, URI_API_PROPERTY } from './../../constants';

  // getting path params
  const params = uri.parse(window.location.pathname, URI_PROPERTY_DELETE); // TODO Extract this to route logic.
  const id = parseInt(params.id, 10);

  // deleting element
  const uriToPropertyApi = uri.compile(URI_API_PROPERTY, { id });
  api.delete(uriToPropertyApi).then(() => {
    navigate(URI_PROPERTY_INDEX);
  });
</script>

<style>
	h1 {
		color: purple;
	}
</style>

<h1>Property delete page</h1>
