import { InMemoryCache, ApolloClient } from '@apollo/client'
import { createApolloProvider } from '@vue/apollo-option'

const cache = new InMemoryCache()

const client = new ApolloClient({
  cache,
  uri: '/.netlify/functions/graphql'
})

export const provider = createApolloProvider({
  defaultClient: client
})
