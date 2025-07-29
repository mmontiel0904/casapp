import { ApolloClient, InMemoryCache, createHttpLink, from } from '@apollo/client'
import { onError } from '@apollo/client/link/error'
import { setContext } from '@apollo/client/link/context'

// Error handling link for centralized error processing
const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path, extensions }) => {
      console.error(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
        extensions
      )
    })
  }

  if (networkError) {
    console.error(`[Network error]: ${networkError}`)
    
    // Handle specific network errors
    if (networkError.message.includes('Failed to fetch')) {
      console.error('Network connection failed - check if API server is running')
    }
  }
})

// Auth link for adding authentication headers
const authLink = setContext((_, { headers }) => {
  // Get token from localStorage or state management
  const token = localStorage.getItem('auth_token')
  
  return {
    headers: {
      ...headers,
      ...(token && { authorization: `Bearer ${token}` })
    }
  }
})

// HTTP link for GraphQL endpoint
const httpLink = createHttpLink({
  uri: `${import.meta.env.VITE_API_BASE_URL}${import.meta.env.VITE_GRAPHQL_ENDPOINT}`,
  credentials: 'include' // Include cookies for CORS
})

// Enhanced cache configuration
const cache = new InMemoryCache({
  typePolicies: {
    User: {
      fields: {
        // Cache user data more aggressively
        id: {
          merge: false
        }
      }
    },
    Query: {
      fields: {
        me: {
          // Cache user profile for 5 minutes
          merge: true
        }
      }
    }
  }
})

export const apolloClient = new ApolloClient({
  link: from([errorLink, authLink, httpLink]),
  cache,
  defaultOptions: {
    watchQuery: {
      errorPolicy: 'all',
      fetchPolicy: 'cache-first'
    },
    query: {
      errorPolicy: 'all',
      fetchPolicy: 'cache-first'
    },
    mutate: {
      errorPolicy: 'all'
    }
  },
  connectToDevTools: import.meta.env.DEV
})

// Helper functions for cache management
export const clearCache = () => {
  apolloClient.cache.reset()
}

export const clearAuthData = () => {
  localStorage.removeItem('auth_token')
  apolloClient.cache.evict({ fieldName: 'me' })
  apolloClient.cache.gc()
}

export const setAuthToken = (token: string) => {
  localStorage.setItem('auth_token', token)
}