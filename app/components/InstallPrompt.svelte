<script>
  let container;
  let install;

  window.addEventListener('beforeinstallprompt', (deferredPrompt) => {
    deferredPrompt.preventDefault();
    install.addEventListener('click', (e) => {
      container.style.display = 'none';

      deferredPrompt.prompt();
      deferredPrompt.userChoice.then(() => {
        deferredPrompt = null;
      });
    });

    container.style.display = 'block';
  });
</script>

<div style="display: none;" bind:this={container}>
  <br/>
  <div class="alert alert-info fade show" role="alert">
    <strong>Install our app to the home screen.</strong> <a href="#" bind:this={install}>Click the link to install the app</a>
  </div>
</div>
