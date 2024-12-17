<script lang="ts">
  import { page } from "$app/stores";
  import { client } from "$lib/graphql/client";
  import { EPISODES_QUERY } from "$lib/graphql/queries";
  import { queryStore } from "@urql/svelte";

  $: seasonNumber = $page.params.season || '1';
  $: episodeNumber = $page.params.episode || '1';
  $: episodeId = `S${seasonNumber.padStart(2, "0")}E${episodeNumber.padStart(2, "0")}`;
  
  $: episodeQuery = queryStore({
    client,
    query: EPISODES_QUERY,
    variables: { episode: episodeId },
  });
</script>

<div class="episode-container">
  {#if $episodeQuery.fetching}
    <p>Загрузка...</p>
  {:else if $episodeQuery.error}
    <p>Ошибка: {$episodeQuery.error.message}</p>
  {:else if $episodeQuery.data?.episodes?.results?.[0]}
    {@const episode = $episodeQuery.data.episodes.results[0]}
    <article>
      <header>
        <h1>{episode.name}</h1>
        <p>Эпизод: {episode.episode}</p>
        <p>Дата выхода: {episode.air_date}</p>
      </header>

      <section>
        <h2>Персонажи в эпизоде</h2>
        <div class="characters-grid">
          {#each episode.characters as character}
            <article class="character-card">
              <img src={character.image} alt={character.name} />
              <h3>{character.name}</h3>
              <a href="/character/{character.id}" role="button"> Подробнее </a>
            </article>
          {/each}
        </div>
      </section>
    </article>
  {:else}
    <p>Эпизод не найден</p>
  {/if}
</div>

<style>
  .episode-container {
    padding: 1rem;
  }

  .characters-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 1rem;
    margin-top: 1rem;
  }

  .character-card {
    text-align: center;
  }

  .character-card img {
    width: 100%;
    height: auto;
    border-radius: 0.5rem;
  }
</style>
