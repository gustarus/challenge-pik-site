<script>
  import getFormData from 'get-form-data';
  import { navigate } from 'svelte-routing';
  import api from './../../../instances/api';
  import uri from './../../../instances/uri';
  import { URI_API_PROPERTIES, URI_API_PROPERTY, HTTP_STATUS_VALIDATION_ERROR, URI_PROPERTY_VIEW } from './../../../constants';

  export let data = {
    id: null,
    type: null,
    title: '',
    description: '',
    address: '',
    square: null,
    price: null,
  };

  // TODO Get properties list via api.

  async function onSubmit(e) {
    e.preventDefault();

    try {
      const uriToPropertyApi = data.id
        ? uri.compile(URI_API_PROPERTY, { id: data.id })
        : URI_API_PROPERTIES;
      const processor = data.id ? api.put : api.post;
      const response = await processor(uriToPropertyApi, data);
      navigate(uri.compile(URI_PROPERTY_VIEW, { id: response.data.id }));
    } catch(e) {
      let message = e.response.status === HTTP_STATUS_VALIDATION_ERROR
        ? e.response.data[0].message : e.message;
      alert(message); // TODO Pretty processing for errors.
    }
  }
</script>

<style>
	h1 {
		color: purple;
	}
</style>

<div>Id: {data.id}</div>

<form on:submit={onSubmit}>
  Select type <sup>*</sup>
  <select name="type" bind:value={data.type} required>
    <option value="">-- Select --</option>
    <option value="residential">Residential</option>
    <option value="commercial">Commercial</option>
  </select>

  <label for="title">Title <sup>*</sup></label>
  <input bind:value={data.title} type="text" id="title" name="title" required />

  <label for="description">Description</label>
  <textarea bind:value={data.description} id="description" name="description"></textarea>

  <label for="address">Address <sup>*</sup></label>
  <input bind:value={data.address} type="text" id="address" name="address" required />

  <label for="square">Square <sup>*</sup></label>
  <input bind:value={data.square} type="number" id="square" name="square" required />

  <label for="price">Price <sup>*</sup></label>
  <input bind:value={data.price} type="number" id="price" name="price" required />

  <button type="submit">
    {#if data.id}
      Save
    {:else}
      Create
    {/if}
  </button>
</form>
