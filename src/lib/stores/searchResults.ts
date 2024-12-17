import type { Character } from "$lib/graphql/generated";
import type { Episode } from "$lib/graphql/generated";
import { writable, type Writable } from "svelte/store";

export interface SearchResultsData {
  query: string;
  characters?: Array<{
    id: string;
    name: string;
    image: string;
    species: string;
    status: string;
  }>;
  episodes?: Array<{
    id: string;
    name: string;
    episode: string;
    air_date: string;
  }>;
  error?: string;
}

export interface SearchResults {
  data: SearchResultsData;
  type: string;
  status: number;
}

export const searchResults = writable<SearchResults | null>(null);
