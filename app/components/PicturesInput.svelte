<script>
  import { createEventDispatcher, onMount, beforeUpdate, onDestroy } from 'svelte';
  import uri from './../instances/uri';
  import notify from './../instances/notify';
  import handleApiError from './../helpers/handleApiError';
  import resizePictureFromDataUri from './../helpers/resizePictureFromDataUri';
  import { API_URL, URI_API_PICTURE, PREVIEW_MAX_SIZE, IMAGE_MAX_SIZE } from './../constants';

  export let id = '';

  export let existed = [];
  export let attached = [];
  export let removed = [];

  export let previewMaxSize = PREVIEW_MAX_SIZE;
  export let pictureMaxSize = IMAGE_MAX_SIZE;


  const dispatch = createEventDispatcher();

  const constraints = { video: { width: IMAGE_MAX_SIZE, height: IMAGE_MAX_SIZE }, audio: false };

  let existedPreviews = [];
  let attachedPreviews = [];

  let placeholder;
  let canvas;
  let video;

  beforeUpdate(() => {
    existedPreviews = existed.map((item) => uri.absolute(API_URL, URI_API_PICTURE, { id: item.file_id }));
    attachedPreviews = attached.map((item) => item.preview);
  });

  if (!window.FileReader) {
    throw new Error('Unsupported file api detected');
  }

  async function onAttach(dataURI) {
    // resize pictures for processing
    const preview = await resizePictureFromDataUri(dataURI, previewMaxSize, previewMaxSize);
    const content = await resizePictureFromDataUri(dataURI, pictureMaxSize, pictureMaxSize);

    // prepend picture
    const item = { preview, content };
    attached = [item, ...attached];
  }

  async function onDetach(e) {
    e.preventDefault();
    const index = parseInt(e.target.dataset.index, 10);
    attached.splice(index, 1);
    attached = attached;
  }

  async function onRemove(e) {
    e.preventDefault();
    const index = parseInt(e.target.dataset.index, 10);
    const spliced = existed.splice(index, 1);
    existed = existed;
    removed = [...removed, spliced[0]];
  }

  onMount(() => {
    let width = pictureMaxSize;
    let height = 0;

    function takePicture() {
      const context = canvas.getContext('2d');
      if (width && height) {
        canvas.width = width;
        canvas.height = height;
        context.drawImage(video, 0, 0, width, height);
        onAttach(canvas.toDataURL('image/png'));
      }
    }

    let streaming;
    video.addEventListener('canplay', () => {
      if (!streaming) {
        height = video.videoHeight / (video.videoWidth/width);

        const previewWidth = placeholder.clientWidth;
        const previewHeight = placeholder.clientHeight;

        video.setAttribute('width', previewWidth);
        video.setAttribute('height', previewHeight);

        canvas.setAttribute('width', width);
        canvas.setAttribute('height', height);

        streaming = true;
      }
    }, false);

    placeholder.addEventListener('click', function(e) {
      takePicture();
      e.preventDefault();
    }, false);

    navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
      video.srcObject = stream;
      video.play();
    }).catch((error) => {
      handleApiError(error);
    });
  });

  onDestroy(() => {
    if (video.srcObject) {
      video.srcObject.getTracks().forEach(track => track.stop());
    }
  });
</script>

<style>
  .canvas {
    display: none;
  }

  .pictures {
    font-size: 0;
    margin: -1rem 0 1rem -1rem;
  }

  .pictures__item {
    width: 100px;
    height: 100px;
    position: relative;
    overflow: hidden;
    display: inline-block;
    background-size: cover;
    background-repeat: no-repeat;
    background-position: 50% 50%;
    border: 1px solid #ced4da;
    margin: 1rem 0 0 1rem;
  }

  .pictures__item-placeholder {
    background: #111;
  }

  .pictures__item-placeholder input {
    opacity: 0;
    zoom: 200;
    cursor: pointer;
  }

  .pictures__item-placeholder::before {
    content: '+';
    position: absolute;
    display: block;
    font-size: 80px;
    font-weight: lighter;
    color: #ced4da;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    margin-top: -6px;
  }

  .pictures__item__delete {
    background: rgba(0, 0, 0, 0.2);
    position: absolute;
    top: 0;
    right: 0;
    padding: 10px 13px;
    line-height: 1;
    color: #fff !important;
    font-size: 20px;
    cursor: pointer;
  }
</style>

<div class="row pictures">
  <canvas bind:this={canvas} class="canvas"></canvas>

  <div class="card pictures__item pictures__item-placeholder" bind:this={placeholder}>
    <video bind:this={video}>Video stream not available.</video>
  </div>

  {#each attachedPreviews as src, i}
    <div class="card pictures__item" style="background-image: url({src});">
      <a class="pictures__item__delete" on:click={onDetach} data-index={i}>✕</a>
    </div>
  {/each}

  {#each existedPreviews as src, i}
    <div class="card pictures__item" style="background-image: url({src});">
      <a class="pictures__item__delete" on:click={onRemove} data-index={i}>✕</a>
    </div>
  {/each}
</div>
