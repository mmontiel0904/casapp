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
  // Skip auth headers for local development to avoid CORS issues
  if (import.meta.env.VITE_API_BASE_URL?.includes('127.0.0.1') || 
      import.meta.env.VITE_API_BASE_URL?.includes('localhost')) {
    console.log('Local development detected - skipping auth headers to avoid CORS')
    return { headers }
  }
  
  // Get token from localStorage or state management
  const token = localStorage.getItem('auth_token')
  
  // Only add authorization header if token exists to avoid CORS preflight issues
  const authHeaders = token ? { authorization: `Bearer ${token}` } : {}
  
  return {
    headers: {
      ...headers,
      ...authHeaders
    }
  }
})

// HTTP link for GraphQL endpoint
const httpLink = createHttpLink({
  uri: `${import.meta.env.VITE_API_BASE_URL}${import.meta.env.VITE_GRAPHQL_ENDPOINT}`,
  credentials: 'omit' // Don't send credentials, use Bearer token instead
})

// Simple Apollo cache - let Apollo handle optimization
const cache = new InMemoryCache()

export const apolloClient = new ApolloClient({
  link: from([errorLink, authLink, httpLink]),
  cache,
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