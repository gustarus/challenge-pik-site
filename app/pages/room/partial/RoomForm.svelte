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
    URI_API_ROOM_PICTURES,
    URI_ROOM_VIEW,
    URI_API_ROOM,
    URI_API_ROOMS,
    URI_API_ROOM_PICTURE,
  } from './../../../constants';

  export let property = {
    id: null,
  };

  export let data = {
    property_id: null,
    id: null,
    type: null,
    title: '',
    description: '',
  };

  export let pictures = [];

  let existed = [...pictures];
  let attaches = [];
  let removals = [];

  async function onSubmit(e) {
    e.preventDefault();

    try {
      // save the property room
      const uriToPropertyApi = data.id
        ? uri.compile(URI_API_ROOM, { id: data.id })
        : URI_API_ROOMS;
      const processor = data.id ? api.put : api.post;

      const propertyId = data.property_id || property.id;
      const nextData = { ...data, property_id: propertyId };
      const response = await processor(uriToPropertyApi, nextData);

      // save and bind the pictures
      for (const file of attaches) {
        const blob = convertDataUriToBlob(file.content);

        // upload the file
        const data = new FormData();
        data.append('file', blob);
        const fileResponse = await api.post(URI_API_PICTURES, data);

        // bind the file
        const relationData = { property_room_id: response.data.id, file_id: fileResponse.data.id };
        await api.post(URI_API_ROOM_PICTURES, relationData);
      }

      // delete unused pictures
      for (const picture of removals) {
        await api.delete(uri.compile(URI_API_ROOM_PICTURE, { id: picture.id }));
      }

      navigate(uri.compile(URI_ROOM_VIEW, { property: property.id, id: response.data.id }));
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
    <option value="kitchen">Kitchen</option>
    <option value="dinning-room">Dinning room</option>
    <option value="living-room">Living room</option>
    <option value="bedroom">Bedroom</option>
    <option value="bathroom">Bathroom</option>
    <option value="balcony">Balcony</option>
    <option value="garage">Garage</option>
  </select>

  <label for="title">Title <sup>*</sup></label>
  <input bind:value={data.title} type="text" id="title" name="title" required />

  <label for="description">Description</label>
  <textarea bind:value={data.description} id="description" name="description"></textarea>

  <PicturesInput bind:existed bind:attached={attaches} bind:removed={removals}/>

  <button type="submit">
    {#if data.id}
      Save
    {:else}
      Create
    {/if}
  </button>
</form>
