<script>
  import { navigate } from 'svelte-routing';
  import api from './../../../instances/api';
  import uri from './../../../instances/uri';
  import uniqBy from 'lodash/uniqBy';
  import handleApiError from './../../../helpers/handleApiError';
  import Link from './../../../components/Link.svelte';
  import notify from './../../../instances/notify';
  import PicturesInput from './../../../components/PicturesInput.svelte';
  import ProcessButton from './../../../components/ProcessButton.svelte';
  import PlacemarksEditor from '../../../components/PlacemarksEditor.svelte';
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
    URI_ROOM_INDEX,
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

  export let placemarks = [];


  let picturesData = [];
  $: {
    // drop all pictures with models - we should replace them with new prop data
    const attachedPicturesData = picturesData.filter((item) => !item.model);

    // map received pictures to pictures data
    const receivedPictures = pictures.map((model) => ({
      model,
      id: model.id,
      active: true,
      src: uri.absolute(API_URL, URI_API_PICTURE, { id: model.file_id }),
    }));

    // concat attached pictures with newly received pictures
    picturesData = [...attachedPicturesData, ...receivedPictures];
  }

  let placemarksData = [];
  $: {
    // drop all placemarks with models - we should replace them with new prop data
    const attachedPlacemarksData = placemarksData.filter((item) => !item.model);

    // map received placemarks to placemarks data
    let receivedPlacemarksData = placemarks.map((model) => ({
      model,
      id: model.id,
      active: true,
      x: model.x,
      y: model.y,
      title: model.title,
    }));

    placemarksData = [...attachedPlacemarksData, ...receivedPlacemarksData];
  }


  let attaches = [];
  let removals = [];

  $: cancelUri = data.id
    ? uri.compile(URI_ROOM_VIEW, { property: property.id,  id: data.id })
    : uri.compile(URI_ROOM_INDEX, { property: property.id });


  let editingItem;
  let editingPlacemarks = [];
  async function onSelect(e) {
    const { id } = e.detail.item;

    // pass editing item
    editingItem = e.detail.item;

    // search for picture placemarks
    const existedPlacemarks = placemarksData.filter((placemark) => placemark.property_room_picture_id === id);
    const updatedPlacemarks = placemarksForPictures[id];
    const picturePlacemarks = [...existedPlacemarks, ...updatedPlacemarks];
    editingPlacemarks = uniqBy(picturePlacemarks, 'id');
  }

  async function onCloseClick(e) {
    placemarksForPictures[editingItem.id] = editingPlacemarks;

    editingItem = null;
    editingPlacemarks = [];
  }


  let loading = false;
  async function onSubmit(e) {
    e.preventDefault();
    if (e.target.checkValidity() === false) {
      e.target.classList.add('was-validated');
      return;
    }

    try {
      loading = true;

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
        const fileResponse = await api.upload(URI_API_PICTURES, file.content);

        // connect the file
        const relationData = { property_room_id: response.data.id, file_id: fileResponse.data.id };
        await api.post(URI_API_ROOM_PICTURES, relationData);
      }

      // delete unused pictures
      for (const picture of removals) {
        await api.delete(uri.compile(URI_API_ROOM_PICTURE, { id: picture.id }));
      }

      loading = false;
      navigate(uri.compile(URI_ROOM_VIEW, { property: property.id, id: response.data.id }));
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
      <option value="kitchen">Kitchen</option>
      <option value="dinning-room">Dinning room</option>
      <option value="living-room">Living room</option>
      <option value="bedroom">Bedroom</option>
      <option value="bathroom">Bathroom</option>
      <option value="balcony">Balcony</option>
      <option value="garage">Garage</option>
    </select>
    <div class="invalid-feedback">
      Please choose a type.
    </div>
  </div>

  <div class="form-group">
    <label for="title">Room name <sup class="text-danger">*</sup></label>
    <input bind:value={data.title} type="text" class="form-control" required id="title">
    <div class="invalid-feedback">
      Please choose a name for the room.
    </div>
  </div>

  <div class="form-group">
    <label for="description">Room description</label>
    <textarea bind:value={data.description} id="description" class="form-control"></textarea>
  </div>

  <div class="form-group">
    <label for="pictures">Room pictures</label>
    <PicturesInput
      bind:data={picturesData}
      on:select={onSelect}
    />
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

{#if editingItem}
  <PlacemarksEditor
    src={editingItem.preview || editingItem.content || editingItem.src}
    bind:placemarks={editingPlacemarks}
    on:close={onCloseClick}
  />
{/if}
