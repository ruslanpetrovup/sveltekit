import { gql } from '@urql/svelte';

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
  query Episodes($page: Int!) {
    episodes(page: $page) {
      results {
        id
        name
        episode
        air_date
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