<style>
  .component {
    width: 100%;
    height: 100%;
    position: relative;
  }

  .indicator {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  .content {
    width: 100%;
    height: 100%;
    position: relative;
  }
</style>

<div class="component {$$props.class}">
  <div class="d-flex justify-content-center indicator">
    <div class="spinner-border" role="status">
      <span class="sr-only">Loading...</span>
    </div>
  </div>

  <div class="content">
    <slot></slot>
  </div>
</div>
