<script>
  import auth from './../../instances/auth';
  import api from './../../instances/api';
  import uri from './../../instances/uri';
  import { title } from './../../stores/meta';
  import { Link } from 'svelte-routing';
  import LoadingContent from './../../components/LoadingContent';
  import {
    URI_API_PROPERTIES,
    URI_PROPERTY_CREATE,
    URI_PROPERTY_VIEW,
    URI_API_PROPERTIES_SEARCH,
  } from './../../constants';

  $title = 'My own properties';

  let data = [];
  let loading = true;
  api.get(URI_API_PROPERTIES_SEARCH, { params: { created_by: auth.primary } }).then((response) => {
    data = Object.values(response.data);
    loading = false;
  });

  function getCreateLinkProps() {
    return { class: 'btn btn-success btn-block' }
  }

  function getViewLinkProps() {
    return { class: 'list-group-item list-group-item-action' };
  }
</script>

<style>
  .content {
    margin-top: 1rem;
  }
</style>

<Link to={URI_PROPERTY_CREATE} getProps={getCreateLinkProps}>Create</Link>

<div class="content">
  <LoadingContent loading={loading}>
    {#if data.length}
      <div class="list-group">
        {#each data as item}
          <Link to={uri.compile(URI_PROPERTY_VIEW, {id: item.id})} getProps={getViewLinkProps}>
            {item.title}, {item.address}
          </Link>
        {/each}
      </div>
    {:else}
      <span class="text-muted">Empty list received</span>
    {/if}
  </LoadingContent>
</div>
