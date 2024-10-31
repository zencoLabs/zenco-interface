import { ApolloClient, InMemoryCache } from '@apollo/client'
import { GraphUriAPI } from '../libs/chains'


export const bodhi_ApolloClient = new ApolloClient({
  uri: GraphUriAPI().bodhiURI,
  cache: new InMemoryCache(), 
  queryDeduplication: true,
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-first',
    },
    query: {
      fetchPolicy: 'cache-first',
      errorPolicy: 'all',
    },
  },
})

 