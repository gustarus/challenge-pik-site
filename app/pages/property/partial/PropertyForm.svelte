<script>
  import { navigate } from 'svelte-routing';
  import api from './../../../instances/api';
  import uri from './../../../instances/uri';
  import notify from './../../../instances/notify';
  import PicturesInput from './../../../components/PicturesInput.svelte';
  import convertDataUriToBlob from './../../../helpers/convertDataUriToBlob';
  import {
    API_URL,
    URI_API_PICTURE,
    URI_API_PROPERTIES,
    URI_API_PROPERTY,
    HTTP_STATUS_VALIDATION_ERROR,
    URI_PROPERTY_VIEW,
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

  let existed = [...pictures];
  let attaches = [];
  let removals = [];


  async function onSubmit(e) {
    e.preventDefault();

    try {
      // save the property
      const uriToPropertyApi = data.id
        ? uri.compile(URI_API_PROPERTY, { id: data.id })
        : URI_API_PROPERTIES;
      const processor = data.id ? api.put : api.post;
      const response = await processor(uriToPropertyApi, data);

      // save and bind the pictures
      for (const file of attaches) {
        const blob = convertDataUriToBlob(file.content);

        // upload the file
        const data = new FormData();
        data.append('file', blob);
        const fileResponse = await api.post(URI_API_PICTURES, data);

        // bind the file
        const relationData = { property_id: response.data.id, file_id: fileResponse.data.id };
        await api.post(URI_API_PROPERTY_PICTURES, relationData);
      }

      // delete unused pictures
      for (const picture of removals) {
        await api.delete(uri.compile(URI_API_PROPERTY_PICTURE, { id: picture.id }));
      }

      navigate(uri.compile(URI_PROPERTY_VIEW, { id: response.data.id }));
    } catch(e) {
      let message = e.response && e.response.status && e.response.status === HTTP_STATUS_VALIDATION_ERROR
        ? e.response.data[0].message : e.message;
      notify.show(message);
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

  <PicturesInput bind:existed bind:attached={attaches} bind:removed={removals}/>

  <button type="submit">
    {#if data.id}
      Save
    {:else}
      Create
    {/if}
  </button>
</form>
