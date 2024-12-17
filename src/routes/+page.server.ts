import type { Actions, RequestEvent } from '@sveltejs/kit';
import { client } from '$lib/graphql/client';
import { SEARCH_QUERY } from '$lib/graphql/queries';
import type { Character, Episode } from '$lib/graphql/generated';

interface SearchResult {
  query: string;
  characters?: Array<Character>;
  episodes?: Array<Episode>;
  error?: string;
  timestamp?: number;
}

const CACHE_TTL = 3600000;

export const actions: Actions = {
  search: async ({ request, platform }: RequestEvent): Promise<SearchResult> => {
    const formData = await request.formData();
    const query = formData.get('query')?.toString().trim() || '';

    if (query.length < 3) {
      return {
        query,
        error: 'Запрос должен содержать минимум 3 символа'
      };
    }

    try {
      if (platform?.env?.SEARCH_CACHE) {
        const cached = await platform.env.SEARCH_CACHE.get(query);
        if (cached) {
          const cachedResult: SearchResult = JSON.parse(cached);
          if (cachedResult.timestamp && Date.now() - cachedResult.timestamp < CACHE_TTL) {
            return cachedResult;
          }
        }
      }

      const result = await client.query(SEARCH_QUERY, { query }).toPromise();

      if (result.error) {
        throw new Error(result.error.message);
      }

      const characters = result.data?.characters?.results || [];
      const episodes = result.data?.episodes?.results || [];

      const response: SearchResult = {
        query,
        characters,
        episodes,
        timestamp: Date.now()
      };

      if (characters.length === 0 && episodes.length === 0) {
        response.error = 'По вашему запросу ничего не найдено';
      }

      if (platform?.env?.SEARCH_CACHE) {
        await platform.env.SEARCH_CACHE.put(
          query,
          JSON.stringify(response),
          { expirationTtl: CACHE_TTL / 1000 }
        );
      }

      return response;
    } catch (err) {
      console.error('Search error:', err);
      return {
        query,
        error: 'Произошла ошибка при выполнении поиска'
      };
    }
  }
};