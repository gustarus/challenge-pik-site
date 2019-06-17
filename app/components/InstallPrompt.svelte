<script>
  window.addEventListener('beforeinstallprompt', (deferredPrompt) => {
    deferredPrompt.preventDefault();

    const button = document.getElementById('install');

    button.style.display = 'block';
    button.addEventListener('click', (e) => {
      e.preventDefault();
      button.style.display = 'none';

      deferredPrompt.prompt();
      deferredPrompt.userChoice.then(() => {
        deferredPrompt = null;
      });
    });
  });
</script>

<style>
  .container {
    position: relative;
  }
</style>

<div class="container">
  <a href="/" id="install" style="display: none;">Install our app</a>
</div>
