import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';

export const client = new ApolloClient({
  link: new HttpLink({
    uri: 'http://localhost:8000/graphql/', // Your Django GraphQL Endpoint
  }),
  cache: new InMemoryCache(),
});