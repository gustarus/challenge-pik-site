<script>
  import { logged } from '../../stores/logged';
  import auth from '../../instances/auth';

  const trigger = () => logged.update(() => false);
  auth.logout().then(trigger);
</script>
