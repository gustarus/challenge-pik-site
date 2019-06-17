<script>
  import uri from './../../instances/uri';
  import api from './../../instances/api';
  import PropertyForm from './partial/PropertyForm';
  import { URI_PROPERTY_UPDATE, URI_API_PROPERTY } from './../../constants';

  // getting path params
  const params = uri.parse(window.location.pathname, URI_PROPERTY_UPDATE); // TODO Extract this to route logic.
  const id = parseInt(params.id, 10);

  // loading element
  $: data = {};
  const uriToPropertyApi = uri.compile(URI_API_PROPERTY, { id });
  api.get(uriToPropertyApi).then((response) => {
    $data = response.data;
  });
</script>

<style>
	h1 {
		color: purple;
	}
</style>

<h1>Property update page</h1>
<PropertyForm data={$data} />
