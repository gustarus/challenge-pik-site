<script>
  import Link from './../../components/Link.svelte';
  import { URI_PROPERTY_INDEX } from './../../constants';
  import { title, header } from './../../stores/meta';

  $title = 'Home page';
  $header = 'Hot links';
</script>

<div class="list-group">
  <Link to={URI_PROPERTY_INDEX} class='list-group-item list-group-item-action'>
    My own properties
  </Link>
</div>
