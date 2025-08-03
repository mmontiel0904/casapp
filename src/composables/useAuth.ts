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
   * Initialize auth state from storage
   * Called on app startup
   */
  const initializeAuth = () => {
    const accessToken = tokenManager.getAccessToken()
    const storedRefreshToken = tokenManager.getRefreshToken()
    
    if (accessToken) {
      authToken.value = accessToken
    }
    
    if (storedRefreshToken) {
      refreshToken.value = storedRefreshToken
    }

    // Note: We don't restore user/permissions from storage
    // They will be fetched fresh on next API call or page load
    console.log('🔄 Auth state initialized from storage')
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
    
    // Actions
    login,
    setUser,
    updateTokens,
    logout,
    initializeAuth,
    shouldRefreshToken,
    refreshPermissions,
    refreshCurrentUser
  }
}