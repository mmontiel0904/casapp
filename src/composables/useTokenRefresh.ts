import { ref, computed } from 'vue'
import { useRefreshTokenMutation } from '../generated/graphql'
import { useAuth } from './useAuth'
import { useApolloFeedback } from './useApolloFeedback'

// Composable for manual token refresh
export function useTokenRefresh() {
  const isRefreshing = ref(false)
  
  const { refreshToken, updateTokens, logout } = useAuth()
  const { mutate: refreshTokenMutation, loading, error } = useRefreshTokenMutation()
  
  // Auto-handle feedback for refresh operations
  const feedback = useApolloFeedback()
  feedback.handleMutation(loading, error, () => {
    // Success is handled in the refreshTokens function
  }, {
    successTitle: 'Session Refreshed',
    successMessage: 'Your session has been renewed',
    errorTitle: 'Session Expired'
  })
  
  const refreshTokens = async (): Promise<boolean> => {
    if (isRefreshing.value || !refreshToken.value) {
      return false
    }
    
    try {
      isRefreshing.value = true
      console.log('Refreshing tokens...')
      
      const result = await refreshTokenMutation({
        refreshToken: refreshToken.value
      })
      
      if (result?.data?.refreshToken) {
        const { accessToken, refreshToken: newRefreshToken } = result.data.refreshToken
        
        // Update tokens
        updateTokens(accessToken, newRefreshToken)
        
        console.log('Tokens refreshed successfully')
        return true
      }
      
      throw new Error('Failed to refresh tokens')
    } catch (err) {
      console.error('Token refresh failed:', err)
      
      // Clear all tokens and logout
      logout()
      
      return false
    } finally {
      isRefreshing.value = false
    }
  }
  
  // Check if we should refresh tokens (access token expired but refresh token available)
  const shouldRefresh = (): boolean => {
    return !!refreshToken.value && !isRefreshing.value
  }
  
  return {
    refreshTokens,
    shouldRefresh,
    isRefreshing: computed(() => isRefreshing.value)
  }
}