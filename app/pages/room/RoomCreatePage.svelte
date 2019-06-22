<script>
  import api from './../../instances/api';
  import uri from './../../instances/uri';
  import { title } from './../../stores/meta';
  import LoadingContent from './../../components/LoadingContent.svelte';
  import RoomForm from './partial/RoomForm';
  import { URI_ROOM_INDEX, URI_API_PROPERTY } from './../../constants';

  $title = 'Add room to the property';

  // getting path params
  const params = uri.parse(window.location.pathname, URI_ROOM_INDEX); // TODO Extract this to route logic.
  const propertyId = parseInt(params.property, 10);

  // loading elements
  let property = {};
  api.get(uri.compile(URI_API_PROPERTY, { id: propertyId })).then((response) => {
    property = response.data;

    $title = `Add room to property "${property.title}"`;
  });
</script>

<LoadingContent loading={!property.id}>
  <RoomForm property={property} />
</LoadingContent>
