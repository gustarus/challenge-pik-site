<script>
  import { Link } from 'svelte-routing';
  import { URI_PROPERTY_INDEX } from './../../constants';
</script>

<style>
	h1 {
		color: purple;
	}
</style>

<h1>Default page</h1>

<Link to={URI_PROPERTY_INDEX}>Properties</Link>
