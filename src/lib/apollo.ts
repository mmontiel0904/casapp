import { ApolloClient, InMemoryCache, createHttpLink, from } from '@apollo/client'
import { onError } from '@apollo/client/link/error'
import { setContext } from '@apollo/client/link/context'
import { tokenManager } from './cookies'

// Track refresh token operations to prevent multiple simultaneous refreshes
let isRefreshing = false
let refreshPromise: Promise<string> | null = null

// Refresh token function
async function refreshAuthToken(): Promise<string> {
  if (isRefreshing && refreshPromise) {
    return refreshPromise
  }

  const refreshToken = tokenManager.getRefreshToken()
  if (!refreshToken) {
    throw new Error('No refresh token available')
  }

  isRefreshing = true
  refreshPromise = (async () => {
    try {
      // Import the generated mutation here to avoid circular dependency
      const { REFRESH_TOKEN_MUTATION } = await import('../graphql/mutations')
      
      const result = await apolloClient.mutate({
        mutation: REFRESH_TOKEN_MUTATION,
        variables: { refreshToken },
        // Skip auth for this specific request
        context: { skipAuth: true }
      })

      if (result.data?.refreshToken) {
        const { accessToken, refreshToken: newRefreshToken } = result.data.refreshToken
        
        // Update tokens in storage
        tokenManager.setTokens(accessToken, newRefreshToken)
        
        console.log('Token refreshed successfully')
        return accessToken
      }
      
      throw new Error('Failed to refresh token')
    } catch (error) {
      console.error('Token refresh failed:', error)
      // Clear all tokens on refresh failure
      tokenManager.clearTokens()
      throw error
    } finally {
      isRefreshing = false
      refreshPromise = null
    }
  })()

  return refreshPromise
}

// Enhanced error handling with automatic token refresh
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

// Auth link for adding authentication headers with operation-based logic
const authLink = setContext((operation, { headers, skipAuth }) => {
  // Skip auth if explicitly requested (for refresh token operation)
  if (skipAuth) {
    return { headers }
  }
  
  // Get token from cookies/localStorage via token manager
  const token = tokenManager.getAccessToken()
  
  // Define public operations that don't require authentication
  const publicOperations = [
    'Login',
    'Register', 
    'RequestPasswordReset',
    'ResetPassword',
    'AcceptInvitation',
    'VerifyEmail',
    'Health', // Health check query
    'RefreshToken' // Refresh token operation
  ]
  
  // Get operation name
  const operationName = operation.operationName
  const isPublicOperation = publicOperations.includes(operationName || '')
  
  // For local API endpoints and public operations, skip auth headers to avoid CORS issues
  const isLocalAPI = import.meta.env.VITE_API_BASE_URL?.includes('127.0.0.1') || 
                     import.meta.env.VITE_API_BASE_URL?.includes('localhost')
  
  if (isLocalAPI && isPublicOperation) {
    console.log(`Local development: Skipping auth headers for public operation: ${operationName}`)
    return { headers }
  }
  
  // For protected operations or remote API, add authorization header if token exists
  if (token) {
    console.log(`Adding auth header for operation: ${operationName}`)
    return {
      headers: {
        ...headers,
        authorization: `Bearer ${token}`
      }
    }
  }
  
  // No token available for protected operation
  if (!isPublicOperation) {
    console.warn(`Protected operation ${operationName} attempted without authentication token`)
  }
  
  return { headers }
})

// HTTP link for GraphQL endpoint
const graphqlUrl = `${import.meta.env.VITE_API_BASE_URL}${import.meta.env.VITE_GRAPHQL_ENDPOINT}`
console.log('Apollo Client GraphQL URL:', graphqlUrl)
console.log('VITE_API_BASE_URL:', import.meta.env.VITE_API_BASE_URL)
console.log('VITE_GRAPHQL_ENDPOINT:', import.meta.env.VITE_GRAPHQL_ENDPOINT)

const httpLink = createHttpLink({
  uri: graphqlUrl,
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
  tokenManager.clearTokens()
  apolloClient.cache.evict({ fieldName: 'me' })
  apolloClient.cache.gc()
}

export const setAuthToken = (token: string) => {
  // Backward compatibility - store only access token
  localStorage.setItem('auth_token', token)
}

// Export the refresh function for manual use if needed
export { refreshAuthToken }