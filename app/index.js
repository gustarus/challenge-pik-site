import App from "./App.svelte";

const app = new App({
	target: document.getElementById('root'),
	// hydrate: true
});

window.app = app;

export default app;
