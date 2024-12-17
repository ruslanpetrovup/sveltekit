<script lang="ts">
  import { page } from "$app/stores";
  import { client } from "$lib/graphql/client";
  import {
    type Episode,
    type Character,
    ALL_EPISODES_QUERY,
  } from "$lib/graphql/queries";
  import { onMount } from "svelte";

  let allEpisodes: Episode[] = [];
  let loading = true;
  let errorMessage = "";

  function extractSeason(episodeCode: string): string {
    const match = episodeCode.match(/^(S\d{2})E\d{2}$/);
    return match ? match[1] : 'S01';
  }

  async function fetchAllEpisodes() {
    try {
        let page = 1;
      let hasMoreResults = true;
      let allResults: Episode[] = [];

      while (hasMoreResults) {
        const result = await client.query(ALL_EPISODES_QUERY, { page }).toPromise();
        if (result.error) throw result.error;

        const episodes = result.data.episodes.results;
        if (episodes.length === 0) {
          hasMoreResults = false;
        } else {
          allResults = [...allResults, ...episodes];
          page++;
        }
      }

      allEpisodes = allResults;
    } catch (error: any) {
      errorMessage = error.message || "Произошла ошибка при загрузке эпизодов.";
    } finally {
      loading = false;
    }
  }

  onMount(async () => {
    await fetchAllEpisodes();
  });

  $: seasonNumber = $page.params.season;
  $: seasonPrefix = `S${seasonNumber.padStart(2, "0")}`;

  $: seasonEpisodes = allEpisodes.filter(
    (ep) => extractSeason(ep.episode) === seasonPrefix
  );

  $: characters = Array.from(
    new Set(
      seasonEpisodes.flatMap((ep) => ep.characters.map((char) => char.id))
    )
  ).map((id) => {
    return seasonEpisodes
      .flatMap((ep) => ep.characters)
      .find((char) => char.id === id)!;
  });
</script>

<h1>Сезон {parseInt(seasonNumber, 10)}</h1>

{#if loading}
  <p>Загрузка...</p>
{:else if errorMessage}
  <p>Ошибка: {errorMessage}</p>
{:else if seasonEpisodes.length > 0}
  <section>
    <h2>Эпизоды</h2>
    <div class="grid">
      {#each seasonEpisodes as episode}
        <article>
          <h3>{episode.name}</h3>
          <p>Код эпизода: {episode.episode}</p>
          <p>Дата выхода: {episode.air_date}</p>
          <a
            href="/season/{seasonNumber}/{episode.episode.slice(1,3)}"
            role="button">Смотреть эпизод</a
          >
        </article>
      {/each}
    </div>
  </section>

  <section>
    <h2>Персонажи</h2>
    <div class="grid">
      {#each characters as character}
        <article>
          <img src={character.image} alt={character.name} />
          <h3>{character.name}</h3>
          <a href="/character/{character.id}" role="button">Подробнее</a>
        </article>
      {/each}
    </div>
  </section>
{:else}
  <p>Сезон не найден</p>
{/if}

<style>
  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 1rem;
    margin-bottom: 2rem;
  }

  article {
    padding: 1rem;
    border: 1px solid #ccc;
    border-radius: 0.5rem;
    text-align: center;
  }

  a {
    text-decoration: none;
    color: white;
    background-color: #007bff;
    padding: 0.5rem 1rem;
    border-radius: 0.3rem;
    display: inline-block;
    margin-top: 0.5rem;
  }

  a:hover {
    background-color: #0056b3;
  }

  img {
    width: 100%;
    height: auto;
    border-radius: 0.5rem;
    margin-bottom: 0.5rem;
  }

  h1,
  h2,
  h3 {
    color: #333;
  }

  p {
    color: #555;
  }

  section {
    margin-top: 2rem;
  }
</style>
