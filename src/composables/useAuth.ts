import { ref, computed } from 'vue'
import { authService, ApiResult } from '../services/api'
import { setAuthToken, clearAuthData } from '../lib/apollo'
import type { User, AuthPayload } from '../generated/graphql'
import { useApiOperation } from './useApiState'

// Global auth state
const currentUser = ref<User | null>(null)
const isAuthenticated = computed(() => !!currentUser.value)
const authToken = ref<string | null>(localStorage.getItem('auth_token'))

// Composable for authentication operations
export function useAuth() {
  const loginOperation = useApiOperation<AuthPayload>()
  const registerOperation = useApiOperation<User>()
  const logoutOperation = useApiOperation<void>()
  const meOperation = useApiOperation<User>()

  // Login function
  const login = async (email: string, password: string): Promise<ApiResult<AuthPayload>> => {
    const result = await loginOperation.execute(() => authService.login(email, password))
    
    if (result.isSuccess && result.data) {
      // Store token and user data
      setAuthToken(result.data.accessToken)
      authToken.value = result.data.accessToken
      currentUser.value = result.data.user
    }
    
    return result
  }

  // Register function
  const register = async (input: {
    email: string
    password: string
    firstName?: string
    lastName?: string
  }): Promise<ApiResult<User>> => {
    return await registerOperation.execute(() => authService.register(input))
  }

  // Logout function
  const logout = async (): Promise<void> => {
    await logoutOperation.execute(async () => {
      // Clear local data
      clearAuthData()
      authToken.value = null
      currentUser.value = null
      
      return ApiResult.success(undefined)
    })
  }

  // Get current user
  const getCurrentUser = async (): Promise<ApiResult<User>> => {
    const result = await meOperation.execute(() => authService.getCurrentUser())
    
    if (result.isSuccess && result.data) {
      currentUser.value = result.data
    }
    
    return result
  }

  // Initialize auth state on app load
  const initializeAuth = async (): Promise<void> => {
    const token = localStorage.getItem('auth_token')
    if (token) {
      authToken.value = token
      await getCurrentUser()
    }
  }

  // Verify email
  const verifyEmail = async (token: string) => {
    return await authService.verifyEmail(token)
  }

  return {
    // State
    currentUser: computed(() => currentUser.value),
    isAuthenticated,
    authToken: computed(() => authToken.value),
    
    // Operations
    login,
    register,
    logout,
    getCurrentUser,
    verifyEmail,
    initializeAuth,
    
    // Loading states
    isLoggingIn: loginOperation.isLoading,
    isRegistering: registerOperation.isLoading,
    isLoggingOut: logoutOperation.isLoading,
    isLoadingUser: meOperation.isLoading,
    
    // Error states
    loginError: loginOperation.error,
    registerError: registerOperation.error,
    logoutError: logoutOperation.error,
    userError: meOperation.error
  }
}