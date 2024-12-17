<script lang="ts">
  import { page } from "$app/stores";
  import { client } from "$lib/graphql/client";
  import { CHARACTER_QUERY } from "$lib/graphql/queries";
  import { queryStore } from "@urql/svelte";

  $: characterQuery = queryStore({
    client,
    query: CHARACTER_QUERY,
    variables: { id: $page.params.id },
  });
</script>

<div class="character-container">
  {#if $characterQuery.fetching}
    <p>Загрузка...</p>
  {:else if $characterQuery.error}
    <p>Ошибка: {$characterQuery.error.message}</p>
  {:else if $characterQuery.data?.character}
    {@const character = $characterQuery.data.character}
    <article class="character-info">
      <div class="character-header">
        <img src={character.image} alt={character.name} />
        <div>
          <h1>{character.name}</h1>
          <p>Статус: {character.status}</p>
          <p>Вид: {character.species}</p>
          <p>Пол: {character.gender}</p>
          <p>Происхождение: {character.origin.name}</p>
          <p>Текущая локация: {character.location.name}</p>
        </div>
      </div>

      <section>
        <h2>Появления в эпизодах</h2>
        <div class="episodes-grid">
          {#each character.episode as episode}
            <article>
              <h3>{episode.name}</h3>
              <p>{episode.episode}</p>
              <a
                href="/season/{episode.episode.slice(1, 3)}/{episode.episode.slice(4)}"
                role="button"
              >
                Смотреть эпизод
              </a>
            </article>
          {/each}
        </div>
      </section>
    </article>
  {:else}
    <p>Персонаж не найден</p>
  {/if}
</div>

<style>
  .character-container {
    padding: 1rem;
  }

  .character-header {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 2rem;
    margin-bottom: 2rem;
  }

  .character-header img {
    width: 300px;
    height: auto;
    border-radius: 0.5rem;
  }

  .episodes-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 1rem;
  }
</style>
