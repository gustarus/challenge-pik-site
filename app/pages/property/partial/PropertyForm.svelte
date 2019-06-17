<script>
  import getFormData from 'get-form-data';
  import { navigate } from 'svelte-routing';
  import api from './../../../instances/api';
  import uri from './../../../instances/uri';
  import {
    URI_API_PROPERTIES,
    URI_API_PROPERTY,
    HTTP_STATUS_VALIDATION_ERROR,
    URI_PROPERTY_VIEW,
    URI_API_PICTURES,
    URI_API_PROPERTY_PICTURES,
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

  const uploads = [];

  // TODO Get properties list via api.

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
      for (const file of uploads) {
        // upload the file
        const data = new FormData();
        data.append('file', file);
        const fileResponse = await api.post(URI_API_PICTURES, data);

        // bind the file
        const relationData = { property_id: response.data.id, file_id: fileResponse.data.id };
        await api.post(URI_API_PROPERTY_PICTURES, relationData);
      }

      navigate(uri.compile(URI_PROPERTY_VIEW, { id: response.data.id }));
    } catch(e) {
      let message = e.response.status === HTTP_STATUS_VALIDATION_ERROR
        ? e.response.data[0].message : e.message;
      alert(message); // TODO Pretty processing for errors.
    }
  }

  async function onCapture(e) {
    const files = e.target.files; // TODO Check files api support.
    for (let i = 0; files[i]; i++) {
      const file = files[i];
      if (!file.type.match('image.*')) { // TODO Show alert when it is not a picture.
        continue;
      }

      uploads.push(file);

      const reader = new FileReader();
      reader.onload = (e) => {
        const span = document.createElement('div');
        span.classList.add('picture'); // TODO Check class list availability.
        span.innerHTML = `<img src="${e.target.result}" title="${escape(file.name)}"/>`;
        document.getElementById('pictures').insertBefore(span, null);
      };

      reader.readAsDataURL(file);
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

  <div id="pictures">
    <div class="picture picture-placeholder">
      <input type="file" accept="image/*" capture="camera" on:change={onCapture} />
    </div>
  </div>

  <button type="submit">
    {#if data.id}
      Save
    {:else}
      Create
    {/if}
  </button>
</form>
