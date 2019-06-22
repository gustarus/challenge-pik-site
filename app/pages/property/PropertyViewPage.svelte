<script>
  import { Link } from 'svelte-routing';
  import uri from './../../instances/uri';
  import api from './../../instances/api';
  import { title } from './../../stores/meta';
  import LoadingContent from './../../components/LoadingContent.svelte';
  import PropertyView from './partial/PropertyView';
  import {
    URI_PROPERTY_VIEW,
    URI_API_PROPERTY,
    URI_API_PROPERTY_PICTURES_SEARCH,
    URI_ROOM_INDEX,
    URI_PROPERTY_DELETE,
  } from './../../constants';

  $title = 'Details about the property';

  // getting path params
  const params = uri.parse(window.location.pathname, URI_PROPERTY_VIEW); // TODO Extract this to route logic.
  const id = parseInt(params.id, 10);

  // loading element
  let data = {};
  let pictures = [];
  const uriToPropertyApi = uri.compile(URI_API_PROPERTY, { id });
  api.get(uriToPropertyApi).then((response) => {
    data = response.data;

    $title = `Details about the property "${data.title}"`;

    const query = { property_id: data.id };
    return api.get(URI_API_PROPERTY_PICTURES_SEARCH, query);
  }).then((response) => {
    pictures = Object.values(response.data);
  });
</script>

<LoadingContent loading={!data.id}>
  <PropertyView data={data} pictures={pictures} />
</LoadingContent>
