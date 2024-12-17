<script lang="ts">
  import { page } from "$app/stores";
  import { derived } from "svelte/store";

  interface Breadcrumb {
    name: string;
    href: string;
  }

  const breadcrumbs = derived(page, ($page) => {
    const path = $page.url.pathname;
    const segments = path.split("/").filter((segment) => segment);

    const crumbs: Breadcrumb[] = [];
    let href = "";

    segments.forEach((segment, index) => {
      href += `/${segment}`;
      let name = segment;

      if (index === 0) {
        if (segment === "season") {
          name = "Сезоны";
        } else if (segment === "character") {
          name = "Персонажи";
        }
      } else if (index === 1 && segments[0] === "season") {
        name = `Сезон ${parseInt(segment, 10)}`;
      } else if (index === 2 && segments[0] === "season") {
        name = `Эпизод ${parseInt(segment, 10)}`;
      } else if (index === 1 && segments[0] === "character") {
        name = `Персонаж #${segment}`;
      }

      crumbs.push({
        name,
        href,
      });
    });

    return crumbs;
  });
</script>

<nav aria-label="Breadcrumb">
  <ol>
    <li><a href="/">Главная</a></li>
    {#each $breadcrumbs as crumb, index}
      <li class="separator">/</li>
      <li>
        {#if index === $breadcrumbs.length - 1}
          <span>{crumb.name}</span>
        {:else}
          <a href={crumb.href}>{crumb.name}</a>
        {/if}
      </li>
    {/each}
  </ol>
</nav>

<style>
  nav {
    margin: 1rem 0;
  }

  ol {
    list-style: none;
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    padding: 0;
    margin: 0;
  }

  li {
    display: flex;
    align-items: center;
  }

  a {
    text-decoration: none;
    color: var(--link-color, blue);
  }

  a:hover {
    text-decoration: underline;
  }

  span {
    color: var(--text-color, black);
  }

  .separator {
    color: var(--text-color, black);
  }
</style>
