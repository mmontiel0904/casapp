import { ref, computed } from 'vue'
import { setAuthToken, clearAuthData } from '../lib/apollo'
import { tokenManager } from '../lib/cookies'
import { permissionService, type AuthUser } from '../services/permissions'
import { useMyPermissionsLazyQuery } from '../generated/graphql'
import type { User } from '../generated/graphql'

// Enhanced auth state management with refresh token support
const currentUser = ref<AuthUser | null>(null)
const authToken = ref<string | null>(tokenManager.getAccessToken())
const refreshToken = ref<string | null>(tokenManager.getRefreshToken())

export function useAuth() {
  const isAuthenticated = computed(() => !!currentUser.value && !!authToken.value)
  const hasRefreshToken = computed(() => !!refreshToken.value)

  // Lazy query for user permissions
  const { load: loadPermissions } = useMyPermissionsLazyQuery()

  // Set user with both access and refresh tokens and sync permissions
  const setUser = async (user: User, accessToken: string, newRefreshToken?: string) => {
    // Convert User to AuthUser and set basic data
    const authUser: AuthUser = {
      ...user,
      permissions: [] // Will be populated after fetching
    }
    
    currentUser.value = authUser
    authToken.value = accessToken
    
    if (newRefreshToken) {
      refreshToken.value = newRefreshToken
      // Store both tokens securely
      tokenManager.setTokens(accessToken, newRefreshToken)
    } else {
      // Backward compatibility - only access token provided
      setAuthToken(accessToken)
    }

    // Update permission service with user data
    permissionService.setUser(authUser)

    // Fetch user permissions if user has a role
    if (user.role && user.id) {
      try {
        const permissionsResult = await loadPermissions(undefined, { userId: user.id })
        
        // Handle the result properly - it can be false or the actual result
        if (permissionsResult && typeof permissionsResult === 'object' && 'data' in permissionsResult) {
          const data = permissionsResult.data as { userPermissions: string[] } | undefined
          const permissions = data?.userPermissions || []
          
          // Update user with permissions
          authUser.permissions = permissions
          currentUser.value = authUser
          
          // Update permission service with complete data
          permissionService.setUser(authUser)
          
          console.log('User permissions loaded:', permissions)
        } else {
          console.warn('Permissions query returned unexpected result:', permissionsResult)
        }
      } catch (error) {
        console.warn('Could not load user permissions:', error)
        // Continue without permissions if fetch fails
      }
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
    
    // Clear permission service data
    permissionService.clearUser()
  }

  // Refresh user permissions
  const refreshPermissions = async () => {
    if (currentUser.value?.id) {
      try {
        const permissionsResult = await loadPermissions(undefined, { userId: currentUser.value.id })
        
        // Handle the result properly - it can be false or the actual result
        if (permissionsResult && typeof permissionsResult === 'object' && 'data' in permissionsResult) {
          const data = permissionsResult.data as { userPermissions: string[] } | undefined
          const permissions = data?.userPermissions || []
          
          // Update user with new permissions
          if (currentUser.value) {
            currentUser.value.permissions = permissions
            permissionService.setUser(currentUser.value)
          }
          
          console.log('User permissions refreshed:', permissions)
          return permissions
        } else {
          console.warn('Permissions refresh returned unexpected result:', permissionsResult)
          return []
        }
      } catch (error) {
        console.warn('Could not refresh user permissions:', error)
        return []
      }
    }
    return []
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

    // Note: We don't restore user/permissions from storage
    // They will be fetched fresh on next API call or login
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
    shouldRefreshToken,
    refreshPermissions
  }
}