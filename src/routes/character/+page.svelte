<script lang="ts">
    import { onMount } from "svelte";
    import { client } from "$lib/graphql/client";
    import { ALL_CHARACTERS_QUERY, type Character } from "$lib/graphql/queries";
    
    let characters: Character[] = [];
    let loading = true;
    let error: string | null = null;
    let currentPage = 1;
    let totalPages = 0;
  
    async function fetchCharacters(page: number) {
      try {
        const result = await client.query(ALL_CHARACTERS_QUERY, { page }).toPromise();
        
        if (result.error) throw result.error;
        
        characters = result.data.characters.results;
        totalPages = result.data.characters.info.pages;
        loading = false;
      } catch (e: any) {
        error = e.message;
        loading = false;
      }
    }
  
    function changePage(newPage: number) {
      if (newPage >= 1 && newPage <= totalPages) {
        currentPage = newPage;
        loading = true;
        fetchCharacters(currentPage);
      }
    }
  
    onMount(() => {
      fetchCharacters(currentPage);
    });
  </script>
  
  <h1>Все персонажи</h1>
  
  {#if loading}
    <p>Загрузка...</p>
  {:else if error}
    <p class="error">Ошибка: {error}</p>
  {:else}
    <div class="grid">
      {#each characters as character}
        <article>
          <img src={character.image} alt={character.name} />
          <h3>{character.name}</h3>
          <p>Статус: {character.status}</p>
          <p>Вид: {character.species}</p>
          <p>Локация: {character.location.name}</p>
          <a href="/character/{character.id}" role="button">Подробнее</a>
        </article>
      {/each}
    </div>
  
    <div class="pagination">
      <button 
        on:click={() => changePage(currentPage - 1)} 
        disabled={currentPage === 1}
      >
        Назад
      </button>
      <span>Страница {currentPage} из {totalPages}</span>
      <button 
        on:click={() => changePage(currentPage + 1)} 
        disabled={currentPage === totalPages}
      >
        Вперед
      </button>
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
  
    img {
      width: 100%;
      height: auto;
      border-radius: 0.5rem;
      margin-bottom: 0.5rem;
    }
  
    .pagination {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 1rem;
      margin: 2rem 0;
    }
  
    .error {
      color: var(--form-element-invalid-color);
    }
  </style>