<script>
  import Link from './../../../components/Link.svelte';
  import uri from './../../../instances/uri';
  import LoadingPicture from './../../../components/LoadingPicture.svelte';
  import {
    API_URL,
    URI_ROOM_INDEX,
    URI_API_PICTURE,
    URI_PROPERTY_UPDATE,
    URI_PROPERTY_DELETE,
  } from './../../../constants';

  export let data = {};
  export let pictures = [];
</script>

<style>
  .component {
    margin-top: 2rem;
    margin-bottom: 1rem;
  }

  .pictures {
    margin: -1rem 0 0 -1rem;
  }

  .pictures__item {
    display: inline-block;
    border: 1px solid #ced4da;
    height: 200px;
    min-width: 100px;
    text-align: center;
    margin: 1rem 0 0 1rem;
  }

  .pictures__item-content {
    height: 100%;
  }
</style>

<Link to={uri.compile(URI_ROOM_INDEX, { property: data.id })} class="btn btn-secondary btn-block">Rooms</Link>

<div class="jumbotron jumbotron-fluid component">
  <div class="container">
    <h4>[{data.type}] {data.square} meters per {data.price}₽ month</h4>
    <h1 class="display-4">{data.title}</h1>

    <p class="lead">
      {#if data.description}
        {data.description}
      {:else}
        <span class="text-muted">Empty description.</span>
      {/if}
    </p>

    {#if pictures.length}
      <div class="pictures">
        {#each pictures as picture}
          <div class="card pictures__item">
            <LoadingPicture>
              <img src={API_URL}{uri.compile(URI_API_PICTURE, { id: picture.file_id })} class="pictures__item-content" />
            </LoadingPicture>
          </div>
        {/each}
      </div>
    {/if}
  </div>
</div>

<Link to={uri.compile(URI_PROPERTY_UPDATE, { id: data.id })} class="btn btn-secondary btn-block">Update</Link>
<Link to={uri.compile(URI_PROPERTY_DELETE, { id: data.id })} class="btn btn-danger btn-block">Delete</Link>
