import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authService, type AuthUser } from '../services/auth'
import { permissionService } from '../services/permissions'
import { clearAuthData } from '../lib/apollo'
import { tokenManager } from '../lib/cookies'

export const useAuthStore = defineStore('auth', () => {
  const currentUser = ref<AuthUser | null>(null)
  const authToken = ref<string | null>(tokenManager.getAccessToken())
  const refreshToken = ref<string | null>(tokenManager.getRefreshToken())
  const isLoading = ref(false)
  const permissionsLoading = ref(false)

  const isAuthenticated = computed(() => !!currentUser.value && !!authToken.value)
  const hasRefreshToken = computed(() => !!refreshToken.value)

  const login = async (email: string, password: string): Promise<AuthUser> => {
    isLoading.value = true
    try {
      const basicUser = await authService.login(email, password)
      currentUser.value = basicUser
      authToken.value = authService.getAccessToken()
      refreshToken.value = authService.getRefreshToken()
      permissionService.setUser(basicUser)
      loadCompleteUserDataInBackground(basicUser.id)
      return basicUser
    } finally {
      isLoading.value = false
    }
  }

  const loadCompleteUserDataInBackground = async (userId: string) => {
    try {
      permissionsLoading.value = true
      const completeUser = await authService.getCompleteUserData(userId)
      currentUser.value = completeUser
      permissionService.setUser(completeUser)
    } finally {
      permissionsLoading.value = false
    }
  }

  const setUser = async (user: AuthUser, accessToken: string, newRefreshToken?: string) => {
    currentUser.value = user
    authToken.value = accessToken
    if (newRefreshToken) {
      refreshToken.value = newRefreshToken
      tokenManager.setTokens(accessToken, newRefreshToken)
    }
    permissionService.setUser(user)
    if (!user.permissions && user.id) {
      loadCompleteUserDataInBackground(user.id)
    }
  }

  const updateTokens = (accessToken: string, newRefreshToken: string) => {
    authToken.value = accessToken
    refreshToken.value = newRefreshToken
    tokenManager.setTokens(accessToken, newRefreshToken)
  }

  const logout = async () => {
    isLoading.value = true
    try {
      await authService.logout()
      currentUser.value = null
      authToken.value = null
      refreshToken.value = null
      permissionService.clearUser()
    } finally {
      tokenManager.clearTokens()
      clearAuthData()
      permissionService.clearUser()
      isLoading.value = false
    }
  }

  const refreshPermissions = async (): Promise<string[]> => {
    if (!currentUser.value?.id) return []
    try {
      permissionsLoading.value = true
      const permissions = await authService.getUserPermissions(currentUser.value.id)
      if (currentUser.value) {
        currentUser.value.permissions = permissions
        permissionService.setUser(currentUser.value)
      }
      return permissions
    } finally {
      permissionsLoading.value = false
    }
  }

  const refreshCurrentUser = async (): Promise<AuthUser | null> => {
    if (!currentUser.value?.id) return null
    try {
      isLoading.value = true
      const freshUser = await authService.getCurrentUser()
      currentUser.value = freshUser
      permissionService.setUser(freshUser)
      return freshUser
    } finally {
      isLoading.value = false
    }
  }

  const initializeAuth = () => {
    const accessToken = tokenManager.getAccessToken()
    const storedRefreshToken = tokenManager.getRefreshToken()
    if (accessToken) authToken.value = accessToken
    if (storedRefreshToken) refreshToken.value = storedRefreshToken
  }

  const shouldRefreshToken = (): boolean => {
    return !authToken.value && !!refreshToken.value
  }

  return {
    currentUser,
    authToken,
    refreshToken,
    isAuthenticated,
    hasRefreshToken,
    isLoading,
    permissionsLoading,
    login,
    setUser,
    updateTokens,
    logout,
    initializeAuth,
    shouldRefreshToken,
    refreshPermissions,
    refreshCurrentUser,
    // Pinia persistedstate plugin config for setup stores
    persist: {
      paths: ['currentUser', 'authToken', 'refreshToken']
    }
  }
})
