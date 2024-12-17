import { gql } from "@urql/svelte";

export const SEARCH_QUERY = gql`
  query Search($query: String!) {
    characters(filter: { name: $query }) {
      results {
        id
        name
        image
        species
        status
      }
    }
    episodes(filter: { name: $query }) {
      results {
        id
        name
        episode
        air_date
      }
    }
  }
`;

export const EPISODES_QUERY = gql`
  query Episodes($episode: String!) {
    episodes(filter: { episode: $episode }) {
      results {
        name
        episode
        air_date
        characters {
          id
          name
          image
        }
      }
    }
  }
`;

export const SEASON_QUERY = gql`
  query Season($episode: String!) {
    episodes(filter: { episode: $episode }) {
      results {
        id
        name
        episode
        air_date
        characters {
          id
          name
          image
        }
      }
    }
  }
`;

export const CHARACTER_QUERY = gql`
  query Character($id: ID!) {
    character(id: $id) {
      id
      name
      status
      species
      type
      gender
      origin {
        name
      }
      location {
        name
      }
      image
      episode {
        id
        name
        episode
      }
    }
  }
`;
export const ALL_EPISODES_QUERY = gql`
  query AllEpisodes($page: Int!) {
    episodes(page: $page) {
      info {
        count
        pages
        next
        prev
      }
      results {
        id
        name
        air_date
        episode
        characters {
          id
          name
          image
        }
      }
    }
  }
`;

export const ALL_CHARACTERS_QUERY = gql`
  query GetCharacters($page: Int!) {
    characters(page: $page) {
      info {
        count
        pages
        next
        prev
      }
      results {
        id
        name
        status
        species
        gender
        image
        location {
          name
        }
      }
    }
  }
`;

export interface Season {
  number: number;
  description: string;
}

export interface Character {
  id: string;
  name: string;
  image: string;
  status: string;
  species: string;
  gender: string;
  location: {
    name: string;
  };
}

export interface Episode {
  id: string;
  name: string;
  episode: string;
  air_date: string;
  characters: Character[];
}

export interface SearchResult {
  characters: {
    results: Array<{
      id: string;
      name: string;
      image: string;
      species: string;
      status: string;
    }>;
  };
  episodes: {
    results: Array<{
      id: string;
      name: string;
      episode: string;
      air_date: string;
    }>;
  };
}
