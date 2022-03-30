import { InMemoryCache, ApolloClient } from "@apollo/client";
import { createApolloProvider } from "@vue/apollo-option";

const cache = new InMemoryCache();

const client = new ApolloClient({
  cache: cache,
  uri: "/.netlify/functions",
});

export const provider = createApolloProvider({
  defaultClient: client,
});
