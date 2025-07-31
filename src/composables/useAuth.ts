import { ref, computed } from 'vue'
import { setAuthToken, clearAuthData } from '../lib/apollo'
import { tokenManager } from '../lib/cookies'
import type { User } from '../generated/graphql'

// Enhanced auth state management with refresh token support
const currentUser = ref<User | null>(null)
const authToken = ref<string | null>(tokenManager.getAccessToken())
const refreshToken = ref<string | null>(tokenManager.getRefreshToken())

export function useAuth() {
  const isAuthenticated = computed(() => !!currentUser.value && !!authToken.value)
  const hasRefreshToken = computed(() => !!refreshToken.value)

  // Set user with both access and refresh tokens
  const setUser = (user: User, accessToken: string, newRefreshToken?: string) => {
    currentUser.value = user
    authToken.value = accessToken
    
    if (newRefreshToken) {
      refreshToken.value = newRefreshToken
      // Store both tokens securely
      tokenManager.setTokens(accessToken, newRefreshToken)
    } else {
      // Backward compatibility - only access token provided
      setAuthToken(accessToken)
    }
  }

  // Update tokens after refresh
  const updateTokens = (accessToken: string, newRefreshToken: string) => {
    authToken.value = accessToken
    refreshToken.value = newRefreshToken
    tokenManager.setTokens(accessToken, newRefreshToken)
  }

  // Clear all authentication data
  const logout = () => {
    currentUser.value = null
    authToken.value = null
    refreshToken.value = null
    tokenManager.clearTokens()
    clearAuthData()
  }

  // Initialize auth state from storage (cookies + localStorage fallback)
  const initializeAuth = () => {
    const accessToken = tokenManager.getAccessToken()
    const storedRefreshToken = tokenManager.getRefreshToken()
    
    if (accessToken) {
      authToken.value = accessToken
    }
    
    if (storedRefreshToken) {
      refreshToken.value = storedRefreshToken
    }
  }

  // Check if we need to refresh the token (called from Apollo interceptor)
  const shouldRefreshToken = (): boolean => {
    return !authToken.value && !!refreshToken.value
  }

  return {
    // State - read-only
    currentUser: computed(() => currentUser.value),
    authToken: computed(() => authToken.value),
    refreshToken: computed(() => refreshToken.value),
    isAuthenticated,
    hasRefreshToken,
    
    // Actions
    setUser,
    updateTokens,
    logout,
    initializeAuth,
    shouldRefreshToken
  }
}