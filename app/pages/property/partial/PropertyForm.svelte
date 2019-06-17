<script>
  import getFormData from 'get-form-data';
  import { navigate } from 'svelte-routing';
  import api from './../../../instances/api';
  import uri from './../../../instances/uri';
  import notify from './../../../instances/notify';
  import resizePictureFromDataUri from './../../../helpers/resizePictureFromDataUri';
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
    IMAGE_MAX_WIDTH,
    IMAGE_MAX_HEIGHT,
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

  $: display = pictures;

  $: uploads = [];

  $: removals = [];

  $: previews = [];

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
      for (const i in uploads) {
        const dataUri = resizePictureFromDataUri(previews[i], IMAGE_MAX_WIDTH, IMAGE_MAX_HEIGHT);
        const fileResized = convertDataUriToBlob(dataUri);

        // upload the file
        const data = new FormData();
        data.append('file', fileResized);
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
      let message = e.response.status === HTTP_STATUS_VALIDATION_ERROR
        ? e.response.data[0].message : e.message;
      notify.show(message);
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
        previews[i] = e.target.result;
      };

      reader.readAsDataURL(file);
    }
  }

  async function onUnselect(e) {
    e.preventDefault();
    const index = parseInt(e.target.dataset.index, 10);

    previews.splice(index, 1); // TODO Normal functionality to remove item.
    previews = [...previews];

    uploads.splice(index, 1); // TODO Normal functionality to remove item.
    uploads = [...uploads];
  }

  async function onRemove(e) {
    e.preventDefault();
    const index = parseInt(e.target.dataset.index, 10);
    const picture = display[index];
    display.splice(index, 1); // TODO Normal functionality to remove item.
    display = [...display];
    removals.push(picture);
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
    {#each previews as preview, i}
      <div class="picture">
        <a href="#" on:click={onUnselect} data-index={i}>Delete</a>
        <img src={preview} />
      </div>
    {/each}

    {#each display as picture, i}
      <div class="picture">
        <a href="#" on:click={onRemove} data-index={i}>Delete</a>
        <img src={API_URL}{uri.compile(URI_API_PICTURE, { id: picture.file_id })} />
      </div>
    {/each}

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
