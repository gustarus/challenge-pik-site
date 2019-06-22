<script>
  import { title } from './../stores/meta';

  title.subscribe((value) => {
    if (document.title !== value) {
        document.title = value;
    }
  })
</script>

<slot></slot>
