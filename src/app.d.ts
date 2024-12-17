/// <reference types="@cloudflare/workers-types" />

declare global {
  namespace App {
    interface Platform {
      env: {
        SEARCH_CACHE: KVNamespace;
      };
    }
  }
}

export {};
