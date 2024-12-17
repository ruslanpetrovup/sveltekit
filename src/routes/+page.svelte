<script lang="ts">
  import SearchForm from "$lib/components/SearchForm.svelte";
  import { page } from "$app/stores";
  import { searchResults, type SearchResultsData } from "$lib/stores/searchResults";

  let searchResultsData: SearchResultsData = {
    query: '',
    characters: [],
    episodes: [],
    error: undefined
  };

  $: {
    try {

      if ($searchResults) {
        searchResultsData = $searchResults.data as SearchResultsData;
      }
    } catch (e) {
      console.log(e);
      searchResultsData = {
        query: '',
        characters: [],
        episodes: [],
        error: 'Произошла ошибка при обработке результатов поиска'
      };
    }
  }
</script>

<h1>Каталог Рик и Морти</h1>

<SearchForm />

{#if searchResultsData}
  {#if searchResultsData.error}
    <div class="error">
      <p>{searchResultsData.error}</p>
    </div>
  {:else}
    {#if searchResultsData.episodes && searchResultsData.episodes.length > 0}
      <section>
        <h2>Эпизоды ({searchResultsData.episodes.length})</h2>
        <div class="grid">
          {#each searchResultsData.episodes as episode}
            <article>
              <header>
                <h3>{episode.name}</h3>
              </header>
              <p>Код эпизода: {episode.episode}</p>
              <p>Дата выхода: {episode.air_date}</p>
              <footer>
                <a href="/season/{episode.episode.slice(1, 3)}/{episode.episode.slice(4)}" role="button">
                  Подробнее
                </a>
              </footer>
            </article>
          {/each}
        </div>
      </section>
    {/if}

    {#if searchResultsData.characters && searchResultsData.characters.length > 0}
      <section>
        <h2>Персонажи ({searchResultsData.characters.length})</h2>
        <div class="grid">
          {#each searchResultsData.characters as character}
            <article>
              <img src={character.image} alt={character.name} />
              <header>
                <h3>{character.name}</h3>
              </header>
              <p>Статус: {character.status}</p>
              <p>Вид: {character.species}</p>
              <footer>
                <a href="/character/{character.id}" role="button">
                  Подробнее
                </a>
              </footer>
            </article>
          {/each}
        </div>
      </section>
    {/if}

    {#if (!searchResultsData.episodes || searchResultsData.episodes.length === 0) && 
          (!searchResultsData.characters || searchResultsData.characters.length === 0)}
      <p>По вашему запросу ничего не найдено</p>
    {/if}
  {/if}
{/if}

<style>
  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 1rem;
    margin: 1rem 0;
  }

  img {
    width: 100%;
    height: auto;
    border-radius: 0.5rem;
    margin-bottom: 0.5rem;
  }

  article {
    padding: 1rem;
    border-radius: 0.5rem;
    background: var(--card-background-color);
  }

  .error {
    color: var(--form-element-invalid-color);
    padding: 1rem;
    border: 1px solid var(--form-element-invalid-border-color);
    border-radius: 0.5rem;
    margin: 1rem 0;
  }

  section {
    margin: 2rem 0;
  }
</style>