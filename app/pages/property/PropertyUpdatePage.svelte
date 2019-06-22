<script>
  import uri from './../../instances/uri';
  import api from './../../instances/api';
  import { title } from './../../stores/meta';
  import LoadingContent from './../../components/LoadingContent';
  import PropertyForm from './partial/PropertyForm';
  import { URI_PROPERTY_UPDATE, URI_API_PROPERTY, URI_API_PROPERTY_PICTURES_SEARCH } from './../../constants';

  $title = 'Update property';

  // getting path params
  const params = uri.parse(window.location.pathname, URI_PROPERTY_UPDATE); // TODO Extract this to route logic.
  const id = parseInt(params.id, 10);

  // loading element
  let data = {};
  let pictures = [];
  const uriToPropertyApi = uri.compile(URI_API_PROPERTY, { id });
  api.get(uriToPropertyApi).then((response) => {
    data = response.data;

    $title = `Update property "${data.title}"`;

    // load pictures
    const query = { property_id: data.id };
    return api.get(URI_API_PROPERTY_PICTURES_SEARCH, query);
  }).then((response) => {
    pictures = Object.values(response.data);
  });
</script>

<LoadingContent loading={!data.id}>
  <PropertyForm data={data} pictures={pictures} />
</LoadingContent>
