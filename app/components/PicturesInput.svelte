<script>
  import { createEventDispatcher, onMount, onDestroy } from 'svelte';
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
  export let sourceSelectDefaultLabel = 'Click here to select source';


  const dispatch = createEventDispatcher();

  // previews storage
  $: existedPreviews = existed.map((item) => uri.absolute(API_URL, URI_API_PICTURE, { id: item.file_id }));
  $: attachedPreviews = attached.map((item) => item.preview);

  // capture picture elements
  let videoContainerEl;
  let canvasEl;
  let videoEl;
  let videoElWidth = 1;
  let videoElHeight = 1;
  let activeStream;

  // camera source select elements
  let sourceSelect;
  let sourceSelectLabel = sourceSelectDefaultLabel;

  // capture sizes
  let width = pictureMaxSize;
  let height = 0;

  onMount(async () => {
    await connectActiveStream();
  });

  onDestroy(async () => {
    await stopActiveStream();
  });

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
    e.stopPropagation();
    const index = parseInt(e.target.dataset.index, 10);
    attached.splice(index, 1);
    attached = attached;
  }

  async function onRemove(e) {
    e.preventDefault();
    e.stopPropagation();
    const index = parseInt(e.target.dataset.index, 10);
    const spliced = existed.splice(index, 1);
    existed = existed;
    removed = [...removed, spliced[0]];
  }

  async function onSelectAttached(e) {
    e.preventDefault();
    e.stopPropagation();
    const index = parseInt(e.target.dataset.index, 10);
    const model = attached[index];
    const src = model.content;
    dispatch('select:attached', { index, src, model });
  }

  async function onSelectExisted(e) {
    e.preventDefault();
    e.stopPropagation();
    const index = parseInt(e.target.dataset.index, 10);
    const model = existed[index];
    const src = uri.absolute(API_URL, URI_API_PICTURE, { id: model.file_id });
    dispatch('select:existed', { index, src, model });
  }

  async function captureActiveStream() {
    if (!activeStream) {
      notify.show('Please, select source to take a picture');
      return;
    }

    const context = canvasEl.getContext('2d');
    if (width && height) {
      canvasEl.width = width;
      canvasEl.height = height;
      context.drawImage(videoEl, 0, 0, width, height);
      await onAttach(canvasEl.toDataURL('image/png'));
    }
  }

  async function stopActiveStream() {
    if (activeStream) {
      activeStream.getTracks().forEach((track) => track.stop());
      activeStream = null;
    }
  }

  async function connectActiveStream() {
    videoElWidth = videoContainerEl.clientWidth;
    videoElHeight = videoContainerEl.clientHeight;

    videoEl.setAttribute('width', videoElWidth);
    videoEl.setAttribute('height', videoElHeight);

    videoEl.addEventListener('canplay', () => {
      height = videoEl.videoHeight / (videoEl.videoWidth / width);
      canvasEl.setAttribute('width', width);
      canvasEl.setAttribute('height', height);
    }, false);

    navigator.mediaDevices.enumerateDevices().then((mediaDevices) => {
      sourceSelect.innerHTML = '';
      sourceSelect.appendChild(document.createElement('option'));
      let count = 1;
      mediaDevices.forEach((mediaDevice) => {
        if (mediaDevice.kind === 'videoinput') {
          const option = document.createElement('option');
          option.value = mediaDevice.deviceId;
          const label = mediaDevice.label || `Camera ${count++}`;
          const textNode = document.createTextNode(label);
          option.appendChild(textNode);
          sourceSelect.appendChild(option);
        }
      });
    }).catch(handleApiError);
  }

  async function onCapture(e) {
    e.preventDefault();
    await captureActiveStream();
  }

  async function onSourceChange() {
    await stopActiveStream();

    if (!sourceSelect.value) { // empty option selected
      sourceSelectLabel = sourceSelectDefaultLabel;
      return;
    }

    sourceSelectLabel = sourceSelect.options[sourceSelect.selectedIndex].innerText;

    const constraints = {
      audio: false,
      video: {
        width: IMAGE_MAX_SIZE,
        height: IMAGE_MAX_SIZE,
        deviceId: { exact: sourceSelect.value },
      },
    };

    navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
      activeStream = stream;
      videoEl.srcObject = stream;
      videoEl.play();
    }).catch(handleApiError);
  }
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
    cursor: pointer;
  }

  .pictures__item-source {
    background: rgba(0, 0, 0, 0.4);
    overflow: hidden;
    position: relative;
  }

  .pictures__item-source label {
    display: block;
    font-size: 14px;
    line-height: 20px;
    vertical-align: middle;
    position: relative;
    margin: 0;
    padding: 0 10px;
    color: #fff;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
  }

  .pictures__item-source select {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    -webkit-appearance: none; /** safari height fix */
    opacity: 0;
    cursor: pointer;
  }

  .pictures__item-placeholder {
    cursor: pointer;
  }

  .pictures__item-placeholder video {
    pointer-events: none;
  }

  .pictures__item-placeholder span {
    position: absolute;
    display: block;
    font-size: 50px;
    font-weight: lighter;
    color: rgba(0, 0, 0, 0.4);
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    line-height: 0;
    pointer-events: none;
  }

  .pictures__item__delete {
    background: rgba(0, 0, 0, 0.4);
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
  <canvas bind:this={canvasEl} class="canvas"></canvas>

  <div class="card pictures__item pictures__item-source">
    <label for="source-select">{sourceSelectLabel}</label>
    <select bind:this={sourceSelect} id="source-select" on:change={onSourceChange} />
  </div>

  <div bind:this={videoContainerEl} on:click={onCapture} class="card pictures__item pictures__item-placeholder">
    <video bind:this={videoEl} playsinline autoplay width="1" height="1">Video stream not available.</video>
    <span class="oi" data-glyph="camera-slr"></span>
  </div>

  {#each attachedPreviews as src, i}
    <div class="card pictures__item" style="background-image: url({src});" on:click={onSelectAttached} data-index={i}>
      <a class="pictures__item__delete" on:click={onDetach} data-index={i}>✕</a>
    </div>
  {/each}

  {#each existedPreviews as src, i}
    <div class="card pictures__item" style="background-image: url({src});" on:click={onSelectExisted} data-index={i}>
      <a class="pictures__item__delete" on:click={onRemove} data-index={i}>✕</a>
    </div>
  {/each}
</div>
