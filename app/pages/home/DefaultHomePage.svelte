<script>
  import { Link } from 'svelte-routing';
  import { URI_PROPERTY_INDEX } from './../../constants';
  import { title, header } from './../../stores/meta';

  $title = 'Home page';
  $header = 'Hot links';

  function getLinkProps() {
    return { class: 'list-group-item list-group-item-action' };
  }
</script>

<div class="list-group">
  <Link to={URI_PROPERTY_INDEX} getProps={getLinkProps}>My own properties</Link>
</div>
