<script>
  import { createEventDispatcher, beforeUpdate } from 'svelte';
  import uri from './../instances/uri';
  import notify from './../instances/notify';
  import resizePictureFromDataUri from './../helpers/resizePictureFromDataUri';
  import { API_URL, URI_API_PICTURE, PREVIEW_MAX_SIZE, IMAGE_MAX_SIZE } from './../constants';

  export let existed = [];
  export let attached = [];
  export let removed = [];

  export let previewMaxSize = PREVIEW_MAX_SIZE;
  export let pictureMaxSize = IMAGE_MAX_SIZE;


  const dispatch = createEventDispatcher();

  let existedPreviews = [];
  let attachedPreviews = [];

  beforeUpdate(() => {
    existedPreviews = existed.map((item) => uri.absolute(API_URL, URI_API_PICTURE, { id: item.file_id }));
    attachedPreviews = attached.map((item) => item.preview);
  });

  if (!window.FileReader) {
    throw new Error('Unsupported file api detected');
  }

  async function onAttach(e) {
    const files = e.target.files;
    for (let i = 0; files[i]; i++) {
      const file = files[i];
      if (!file.type.match('image.*')) {
        notify.show('Invalid file passed: should be an image');
        continue;
      }

      // resize pictures and wait while resize finished
      await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          // create resize promises for preview and for content
          const onResizePreview = resizePictureFromDataUri(e.target.result, previewMaxSize, previewMaxSize);
          const onResizeContent = resizePictureFromDataUri(e.target.result, pictureMaxSize, pictureMaxSize);

          // wait while resize promises resolved
          Promise.all([onResizePreview, onResizeContent]).then(([preview, content]) => {
            file.preview = preview;
            file.content = content;
            attached = [...attached, file];
            resolve();
          }).catch(reject);
        };

        reader.readAsDataURL(file);
      });
    }
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
    const model = existed[index];
    removed = [...removed, model];
  }
</script>

<style>
  .pictures {
    font-size: 0;
    margin: -5px;
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
    border: 1px solid #ededed;
    margin: 5px;
  }

  .pictures__item-placeholder {
    background: #fffafa;
  }

  .pictures__item-placeholder input {
    opacity: 0;
    zoom: 200;
  }

  .pictures__item-placeholder::before {
    content: '+';
    position: absolute;
    display: block;
    font-size: 60px;
    color: #8f918e;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    margin-top: -6px;
  }

  .pictures__item__delete {
    background: rgba(255, 255, 255, 0.2);
    position: absolute;
    top: 0;
    right: 0;
    padding: 7px 10px;
    line-height: 1;
    color: #fff;
    font-size: 20px;
  }
</style>

<div class="pictures">
  <div class="pictures__item pictures__item-placeholder">
    <input type="file" accept="image/*" capture="camera" on:change={onAttach} />
  </div>

  {#each attachedPreviews as src, i}
    <div class="pictures__item" style="background-image: url({src});">
      <a class="pictures__item__delete" on:click={onDetach} data-index={i}>✕</a>
    </div>
  {/each}

  {#each existedPreviews as src, i}
    <div class="pictures__item" style="background-image: url({src});">
      <a class="pictures__item__delete" on:click={onRemove} data-index={i}>✕</a>
    </div>
  {/each}
</div>
