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

  export let selected = [];
  export let existed = [];

  const selectedData = selected.map((item) => item.data);

  const existedData = existed.map((item) => uri.absolute(API_URL, URI_API_PICTURE, { id: item.file_id }));

  $: display = pictures;

  $: uploads = [];

  $: removals = [];

  $: previews = [];

  // TODO Get properties list via api.
  // TODO Extract pictures logic to the separate component.

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
      let message = e.response && e.response.status && e.response.status === HTTP_STATUS_VALIDATION_ERROR
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
  .pictures {
    padding: 10px;
    background: red;
  }

  .pictures__placeholder {

  }

  .pictures__item {
    width: 250px;
    height: 250px;
    display: inline-block;
    background-size: cover;
    background-repeat: no-repeat;
    background-position: 50% 50%;
  }

  .pictures__item__delete {

  }
</style>

<div class:pictures>
  {#each selected as src, i}
    <div class:pictures__item style="background-image: url({src});">
      <a class:pictures__item__delete on:click={onUnselect} data-index={i}>x</a>
    </div>
  {/each}

  {#each existed as src, i}
    <div class:pictures__item style="background-image: url({src});">
      <a class:pictures__item__delete on:click={onRemove} data-index={i}>x</a>
    </div>
  {/each}

  <div class:pictures__item class:pictures__placeholder>
    <input type="file" accept="image/*" capture="camera" on:change={onCapture} />
  </div>
</div>
