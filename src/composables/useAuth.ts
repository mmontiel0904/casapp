import { ref, computed } from 'vue'
import { authService, type AuthUser } from '../services/auth'
import { permissionService } from '../services/permissions'
import { clearAuthData } from '../lib/apollo'
import { tokenManager } from '../lib/cookies'

// Enhanced auth state management with optimized two-phase authentication
const currentUser = ref<AuthUser | null>(null)
const authToken = ref<string | null>(tokenManager.getAccessToken())
const refreshToken = ref<string | null>(tokenManager.getRefreshToken())
const isLoading = ref(false)
const permissionsLoading = ref(false)
const isInitializing = ref(false)

export function useAuth() {
  const isAuthenticated = computed(() => !!currentUser.value && !!authToken.value)
  const hasRefreshToken = computed(() => !!refreshToken.value)

  /**
   * Optimized two-phase login following FRONTEND_INTEGRATION guide
   * Phase 1: Fast login with basic user data only (~10-20ms)
   * Phase 2: Background loading of complete user data and permissions
   */
  const login = async (email: string, password: string): Promise<AuthUser> => {
    isLoading.value = true
    try {
      // Phase 1: Fast login - only basic user data + tokens
      console.log('🚀 Starting fast login...')
      const basicUser = await authService.login(email, password)
      
      // Set basic user immediately for instant UI updates
      currentUser.value = basicUser
      authToken.value = authService.getAccessToken()
      refreshToken.value = authService.getRefreshToken()
      
      // Update permission service with basic user
      permissionService.setUser(basicUser)
      
      console.log('✅ Fast login completed')
      
      // Phase 2: Background loading of complete user data
      loadCompleteUserDataInBackground(basicUser.id)
      
      return basicUser
    } catch (error) {
      console.error('❌ Login failed:', error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Background loading of complete user data and permissions
   * This runs after fast login to enhance the user object
   */
  const loadCompleteUserDataInBackground = async (userId: string) => {
    try {
      permissionsLoading.value = true
      console.log('🔄 Loading complete user data in background...')
      
      const completeUser = await authService.getCompleteUserData(userId)
      
      // Update user with complete data including permissions
      currentUser.value = completeUser
      permissionService.setUser(completeUser)
      
      console.log('✅ Complete user data loaded with', completeUser.permissions?.length || 0, 'permissions')
    } catch (error) {
      console.warn('⚠️ Could not load complete user data:', error)
      // Continue without complete data - basic auth still works
    } finally {
      permissionsLoading.value = false
    }
  }

  /**
   * Set user data (for invitation flow and other scenarios)
   * Maintains compatibility with existing code
   */
  const setUser = async (user: AuthUser, accessToken: string, newRefreshToken?: string) => {
    currentUser.value = user
    authToken.value = accessToken
    
    if (newRefreshToken) {
      refreshToken.value = newRefreshToken
      tokenManager.setTokens(accessToken, newRefreshToken)
    }

    // Update permission service
    permissionService.setUser(user)

    // If user has complete data, we're done; otherwise load it
    if (!user.permissions && user.id) {
      loadCompleteUserDataInBackground(user.id)
    }
  }

  /**
   * Update tokens after refresh
   */
  const updateTokens = (accessToken: string, newRefreshToken: string) => {
    authToken.value = accessToken
    refreshToken.value = newRefreshToken
    tokenManager.setTokens(accessToken, newRefreshToken)
  }

  /**
   * Enhanced logout with proper cleanup
   */
  const logout = async () => {
    isLoading.value = true
    try {
      await authService.logout()
      
      // Clear all local state
      currentUser.value = null
      authToken.value = null
      refreshToken.value = null
      
      // Clear permission service data
      permissionService.clearUser()
      
      console.log('✅ Logout completed')
    } catch (error) {
      console.error('❌ Logout error:', error)
      // Force local cleanup even if server logout fails
      currentUser.value = null
      authToken.value = null
      refreshToken.value = null
      tokenManager.clearTokens()
      clearAuthData()
      permissionService.clearUser()
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Refresh user permissions manually
   * Useful after role changes or permission updates
   */
  const refreshPermissions = async (): Promise<string[]> => {
    if (!currentUser.value?.id) return []
    
    try {
      permissionsLoading.value = true
      const permissions = await authService.getUserPermissions(currentUser.value.id)
      
      // Update user with new permissions
      if (currentUser.value) {
        currentUser.value.permissions = permissions
        permissionService.setUser(currentUser.value)
      }
      
      console.log('✅ Permissions refreshed:', permissions.length, 'permissions')
      return permissions
    } catch (error) {
      console.warn('⚠️ Could not refresh permissions:', error)
      return []
    } finally {
      permissionsLoading.value = false
    }
  }

  /**
   * Get current user with fresh data from server
   * Useful for profile updates
   */
  const refreshCurrentUser = async (): Promise<AuthUser | null> => {
    if (!currentUser.value?.id) return null
    
    try {
      isLoading.value = true
      const freshUser = await authService.getCurrentUser()
      currentUser.value = freshUser
      permissionService.setUser(freshUser)
      
      console.log('✅ User data refreshed')
      return freshUser
    } catch (error) {
      console.error('❌ Could not refresh user data:', error)
      return null
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Enhanced session restoration with smart token validation
   * Called on app startup - handles both token restoration and user data recovery
   */
  const initializeAuth = async (): Promise<boolean> => {
    if (isInitializing.value) {
      console.log('🔄 Auth initialization already in progress')
      return false
    }

    isInitializing.value = true
    
    try {
      const accessToken = tokenManager.getAccessToken()
      const storedRefreshToken = tokenManager.getRefreshToken()
      
      console.log('🔄 Initializing auth state from storage...', {
        hasAccessToken: !!accessToken,
        hasRefreshToken: !!storedRefreshToken
      })

      // No tokens at all - user needs to login
      if (!accessToken && !storedRefreshToken) {
        console.log('✅ No stored tokens - user needs to login')
        return false
      }

      // Set tokens in state
      if (accessToken) authToken.value = accessToken
      if (storedRefreshToken) refreshToken.value = storedRefreshToken

      // Strategy 1: Try to restore user data with current access token
      if (accessToken) {
        try {
          console.log('🔄 Attempting to restore user session with access token...')
          const userData = await authService.getCurrentUser()
          
          // Success! User session restored
          currentUser.value = userData
          permissionService.setUser(userData)
          
          // Load permissions in background if user ID available
          if (userData.id) {
            loadCompleteUserDataInBackground(userData.id)
          }
          
          console.log('✅ Session restored successfully with access token')
          return true
          
        } catch (error) {
          console.warn('⚠️ Access token invalid, trying refresh token...', error)
          // Access token expired/invalid, try refresh token
        }
      }

      // Strategy 2: Try refresh token to get new access token + user data
      if (storedRefreshToken) {
        try {
          console.log('🔄 Attempting token refresh and session restore...')
          const refreshResult = await authService.refreshTokens()
          
          // Update tokens
          authToken.value = refreshResult.accessToken
          refreshToken.value = refreshResult.refreshToken
          
          // Get user data (refresh token mutation includes basic user data)
          const userData = await authService.getCurrentUser()
          currentUser.value = userData
          permissionService.setUser(userData)
          
          // Load permissions in background
          if (userData.id) {
            loadCompleteUserDataInBackground(userData.id)
          }
          
          console.log('✅ Session restored successfully with refresh token')
          return true
          
        } catch (error) {
          console.warn('⚠️ Token refresh failed - clearing invalid session', error)
          // Both tokens invalid, clear everything
          await clearInvalidSession()
          return false
        }
      }

      // No valid restoration path
      console.log('❌ No valid tokens available for session restoration')
      return false
      
    } catch (error) {
      console.error('❌ Auth initialization failed:', error)
      await clearInvalidSession()
      return false
    } finally {
      isInitializing.value = false
    }
  }

  /**
   * Clear invalid session data
   * Called when tokens are expired/invalid
   */
  const clearInvalidSession = async () => {
    console.log('🧹 Clearing invalid session data...')
    
    currentUser.value = null
    authToken.value = null
    refreshToken.value = null
    
    tokenManager.clearTokens()
    clearAuthData()
    permissionService.clearUser()
    
    console.log('✅ Invalid session cleared')
  }

  /**
   * Check if we need to refresh the token
   */
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
    isLoading: computed(() => isLoading.value),
    permissionsLoading: computed(() => permissionsLoading.value),
    isInitializing: computed(() => isInitializing.value),
    
    // Actions
    login,
    setUser,
    updateTokens,
    logout,
    initializeAuth,
    shouldRefreshToken,
    refreshPermissions,
    refreshCurrentUser,
    clearInvalidSession
  }
}