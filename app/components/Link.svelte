<script>
  import { Link } from 'svelte-routing';

  export let to;
  export let getProps;

  function getLinkProps(data) {
    const defaults = getProps ? getProps(data) : {};
    return { ...defaults, class: `${$$props.class} ${defaults.class}` };
  }
</script>

<Link to={to} getProps={getLinkProps}>
  <slot></slot>
</Link>
