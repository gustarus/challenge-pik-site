<script context="module">
  let uniqueIndex = 0;

  function getUniquePlacemarkId() {
    const id = `placemark-${uniqueIndex}`;
    uniqueIndex++;
    return id;
  }
</script>

<script>
  import { createEventDispatcher } from 'svelte';
  import { MAX_PLACEMARK_TITLE_LENGTH } from './../constants';


  export let src;
  export let placemarks = [];


  // validate passed data
  placemarks.forEach((placemark) => {
    const { id, x, y, title, active } = placemark;
    if (!id) {
      throw new Error('Placemark `id` is required for every item');
    }

    if (!x || !y) {
      throw new Error(`Coordinates in percents (\`z\` and \`y\`) are required for item with id = \`${id}\``);
    }

    if (!title) {
      throw new Error(`Title (\`title\`) is required for item with id = \`${id}\``);
    }

    if (typeof active !== 'boolean') {
      throw new Error(`Property \`active\` is required and should be boolean for id = \`${id}\``);
    }
  });


  const dispatch = createEventDispatcher();


  let pictureEl;


  async function getTitle(label, initial = '') {
    const title = prompt(label, initial);
    if (!title) {
      return title;
    }

    if (title.length > MAX_PLACEMARK_TITLE_LENGTH) {
      alert(`Too long title. Should be ${MAX_PLACEMARK_TITLE_LENGTH} max`);
      return getTitle(label, title);
    }

    return title.trim();
  }

  async function onClickCreate(e) {
    e.preventDefault();
    e.stopPropagation();

    const rect = pictureEl.getBoundingClientRect();
    const x = (e.x - rect.left) / (pictureEl.clientWidth / 100);
    const y = (e.y - rect.top) / (pictureEl.clientHeight / 100);
    const title = await getTitle('Please enter title for the placemark');
    if (!title) {
      return;
    }

    const id = getUniquePlacemarkId();
    placemarks = [...placemarks, { id, x, y, title, active: true }];
  }

  async function onClickUpdate(e) {
    e.preventDefault();
    e.stopPropagation();
    const index = parseInt(e.target.dataset.index);
    const title = await getTitle('Enter new title or clean up the field to delete the placemark', placemarks[index].title);
    if (title === '') {
      placemarks[index].active = false;
    } else if (typeof title === 'string') {
      placemarks[index] = { ...placemarks[index], title };
    }
  }

  async function onClickClose(e) {
    e.preventDefault();
    dispatch('close', { event: e });
  }
</script>

<style>
  .component {
    padding: 50px;
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(255, 255, 255, 0.9);
    text-align: center;
  }

  .component__overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    filter: blur(10px);
    opacity: 0.4;
  }

  .component__content {
    height: 100%;
    display: inline-block;
    position: relative;
    box-sizing: border-box;
    background-size: contain;
    background-position: center;
    background-repeat: no-repeat;
    text-align: center;
  }

  .component__picture {
    height: 100%;
  }

  .component__placemark {
    display: block;
    position: absolute;
    background: #fff;
    text-align: left;
    padding: 6px 12px;
  }

  .component__placemark::before {
    content: '';
    width: 10px;
    height: 10px;
    background: #ff9e70;
    border-radius: 100%;
    position: absolute;
    top: -5px;
    left: -5px;
  }

  .component__placemark__content {
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 200px;
    max-height: 100px;
    pointer-events: none;
  }

  .component__close {
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

<div class="component">
  <div class="component__overlay" style="background-image: url('{src}');" />
  <div class="component__content">
    <img src="{src}" class="component__picture" on:click={onClickCreate} bind:this={pictureEl} />

    {#each placemarks as { id, x, y, title, active}, i (id)}
      {#if active}
        <div class="component__placemark" style="top: {y}%; left: {x}%;" on:click={onClickUpdate} data-id={id}>
          <div class="component__placemark__content">{title}</div>
        </div>
      {/if}
    {/each}
  </div>

  <span class="component__close" on:click={onClickClose}>✕</span>
</div>
