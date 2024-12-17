<script lang="ts">
  import { client } from "$lib/graphql/client";
  import { ALL_EPISODES_QUERY, type Episode } from "$lib/graphql/queries";
  import { onMount } from "svelte";

  let allEpisodes: Episode[] = [];
  let loading = true;
  let error: string | null = null;

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
      loading = false;
    } catch (e: any) {
      error = e.message;
      loading = false;
    }
  }

  onMount(() => {
    fetchAllEpisodes();
  });

  $: seasons = (() => {
    const seasonSet = new Set<string>();
    allEpisodes.forEach((episode) => {
      const season = extractSeason(episode.episode);
      seasonSet.add(season);
    });
    return Array.from(seasonSet).sort();
  })();
</script>

<h1>Сезоны</h1>

{#if loading}
  <p>Загрузка...</p>
{:else if error}
  <p>Ошибка: {error}</p>
{:else}
  <div class="grid">
    {#each seasons as season}
      <article>
        <h3>{season} - Сезон {parseInt(season.slice(1), 10)}</h3>
        <a href="/season/{parseInt(season.slice(1), 10)}" role="button">
          Смотреть сезон
        </a>
      </article>
    {/each}
  </div>
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
  }

  a:hover {
    background-color: #0056b3;
  }
</style>