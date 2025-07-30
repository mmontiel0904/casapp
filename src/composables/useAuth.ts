import { ref, computed } from 'vue'
import { setAuthToken, clearAuthData } from '../lib/apollo'
import type { User } from '../generated/graphql'

// Minimal auth state management - Apollo handles everything else
const currentUser = ref<User | null>(null)
const authToken = ref<string | null>(localStorage.getItem('auth_token'))

export function useAuth() {
  const isAuthenticated = computed(() => !!currentUser.value && !!authToken.value)

  const setUser = (user: User, token: string) => {
    currentUser.value = user
    authToken.value = token
    setAuthToken(token)
  }

  const logout = () => {
    currentUser.value = null
    authToken.value = null
    clearAuthData()
  }

  const initializeAuth = () => {
    const token = localStorage.getItem('auth_token')
    if (token) {
      authToken.value = token
    }
  }

  return {
    // State - read-only
    currentUser: computed(() => currentUser.value),
    authToken: computed(() => authToken.value),
    isAuthenticated,
    
    // Actions - minimal auth management only
    setUser,
    logout,
    initializeAuth
  }
}