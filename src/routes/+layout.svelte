<script lang="ts">
  import Breadcrumbs from "$lib/components/Breadcrumbs.svelte";
  import Footer from "$lib/components/Footer.svelte";
  import Header from "$lib/components/Header.svelte";
  import "@picocss/pico/css/pico.min.css";
</script>

<div class="container">
  <Header/>

  <main>
    <slot />
  </main>


  <Footer/>
</div>
