import { createClient } from "@urql/svelte";
import { cacheExchange, fetchExchange } from "@urql/svelte";

export const client = createClient({
  url: "https://rickandmortyapi.com/graphql",
  exchanges: [cacheExchange, fetchExchange],
});
