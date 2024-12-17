<script lang="ts">
  import { enhance } from "$app/forms";
  import { invalidateAll } from "$app/navigation";
  import { searchResults, type SearchResults, type SearchResultsData } from "$lib/stores/searchResults";

  let loading = false;
  let searchTerm = "";
  let isValid = true;

  function validateSearch() {
    isValid = searchTerm.length >= 3;
    return isValid;
  }
</script>

<form
  method="POST"
  action="?/search"
  use:enhance={() => {
    loading = true;
    return async ({ result }) => {
      loading = false;
      if (result.type === "success") {
        await invalidateAll();
        searchResults.set({
          data: (result.data as unknown) as SearchResultsData,
          type: result.type,
          status: result.status
        });
      }
    };
  }}
>
  <div class="search-container">
    <input
      type="search"
      name="query"
      bind:value={searchTerm}
      class:invalid={!isValid}
      placeholder="Поиск по названию эпизода или имени персонажа (минимум 3 символа)"
      required
      minlength="3"
      on:input={() => validateSearch()}
    />
    <button type="submit" aria-busy={loading} disabled={loading || !isValid}>
      Поиск
    </button>
  </div>
  {#if !isValid && searchTerm.length > 0}
    <small class="error">Введите минимум 3 символа</small>
  {/if}
</form>

<style>
  .search-container {
    display: flex;
    gap: 1rem;
  }

  .error {
    color: var(--form-element-invalid-border-color);
  }

  input.invalid {
    border-color: var(--form-element-invalid-border-color);
  }
</style>
