<script>
  import { navigate } from 'svelte-routing';
  import Link from './../../../components/Link.svelte';
  import api from './../../../instances/api';
  import uri from './../../../instances/uri';
  import notify from './../../../instances/notify';
  import handleApiError from './../../../helpers/handleApiError';
  import PicturesInput from './../../../components/PicturesInput.svelte';
  import ProcessButton from './../../../components/ProcessButton.svelte';
  import {
    API_URL,
    URI_API_PICTURE,
    URI_API_PROPERTIES,
    URI_API_PROPERTY,
    URI_PROPERTY_VIEW,
    URI_PROPERTY_INDEX,
    URI_API_PICTURES,
    URI_API_PROPERTY_PICTURES,
    URI_API_PROPERTY_PICTURE,
  } from './../../../constants';

  export let data = {
    id: null,
    type: null,
    title: '',
    description: '',
    address: '',
    square: null,
    price: null,
  };

  export let pictures = [];

  let attaches = [];
  let removals = [];

  $: cancelUri = data.id
    ? uri.compile(URI_PROPERTY_VIEW, { id: data.id }) : URI_PROPERTY_INDEX;

  let loading = false;
  async function onSubmit(e) {
    e.preventDefault();
    if (e.target.checkValidity() === false) {
      e.target.classList.add('was-validated');
      return;
    }

    try {
      loading = true;

      // save the property
      const uriToPropertyApi = data.id
        ? uri.compile(URI_API_PROPERTY, { id: data.id })
        : URI_API_PROPERTIES;
      const processor = data.id ? api.put : api.post;
      const response = await processor(uriToPropertyApi, data);

      // save and bind the pictures
      for (const file of attaches) {
        const fileResponse = await api.upload(URI_API_PICTURES, file.content);

        // connect the file
        const relationData = { property_id: response.data.id, file_id: fileResponse.data.id };
        await api.post(URI_API_PROPERTY_PICTURES, relationData);
      }

      // delete unused pictures
      for (const picture of removals) {
        await api.delete(uri.compile(URI_API_PROPERTY_PICTURE, { id: picture.id }));
      }

      loading = false;
      navigate(uri.compile(URI_PROPERTY_VIEW, { id: response.data.id }));
    } catch(e) {
      loading = false;
      handleApiError(e);
    }
  }
</script>

<form on:submit={onSubmit} class="needs-validation" novalidate>
  <div class="form-group">
    <label for="type">Select type <sup class="text-danger">*</sup></label>
    <select bind:value={data.type} class="form-control" required id="type">
      <option value=""></option>
      <option value="residential">Residential</option>
      <option value="commercial">Commercial</option>
    </select>
    <div class="invalid-feedback">
      Please choose a type.
    </div>
  </div>

  <div class="form-group">
    <label for="title">Property name <sup class="text-danger">*</sup></label>
    <input bind:value={data.title} type="text" class="form-control" required id="title">
    <div class="invalid-feedback">
      Please choose a name for the property.
    </div>
  </div>

  <div class="form-group">
    <label for="description">Property description</label>
    <textarea bind:value={data.description} id="description" class="form-control"></textarea>
  </div>

  <div class="form-group">
    <label for="address">Property address <sup class="text-danger">*</sup></label>
    <input bind:value={data.address} type="text" class="form-control" required id="address">
    <div class="invalid-feedback">
      Please enter address for the property.
    </div>
  </div>

  <div class="form-row">
    <div class="col-md-6">
      <div class="form-group">
        <label for="square">Property square <sup class="text-danger">*</sup></label>
        <input bind:value={data.square} type="number" id="square" class="form-control" required />
        <div class="invalid-feedback">
          Please enter square size for the property.
        </div>
      </div>
    </div>

    <div class="col-md-6">
      <div class="form-group">
        <label for="price">Property price <sup class="text-danger">*</sup></label>
        <input bind:value={data.price} type="number" id="price" class="form-control" required />
        <div class="invalid-feedback">
          Please enter price for the property.
        </div>
      </div>
    </div>
  </div>

  <div class="form-group">
    <label for="pictures">Property pictures</label>
    <PicturesInput bind:existed={pictures} bind:attached={attaches} bind:removed={removals} id="pictures" />
  </div>

  <ProcessButton loading={loading}>
    {#if data.id}
      Save
    {:else}
      Create
    {/if}
  </ProcessButton>

  <Link to={cancelUri} class="btn btn-info btn-block">Cancel</Link>
</form>
