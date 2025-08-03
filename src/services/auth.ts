import { apolloClient } from '../lib/apollo'
import { tokenManager } from '../lib/cookies'
import type { 
  LoginMutation, 
  MeQuery, 
  UserPermissionsQuery,
  User 
} from '../generated/graphql'
import { gql } from 'graphql-tag'

// Enhanced AuthUser interface following the guide
// Using intersection type to allow optional permissions
export type AuthUser = Omit<User, 'permissions'> & {
  permissions?: string[]  // Optional - loaded separately for performance
}

// ⚡ FAST LOGIN - No expensive queries during authentication
const FAST_LOGIN_MUTATION = gql`
  mutation FastLogin($input: LoginInput!) {
    login(input: $input) {
      user {
        id
        email
        firstName
        lastName
        isEmailVerified
        createdAt
        updatedAt
        # No role/permissions here for speed!
      }
      accessToken
      refreshToken
    }
  }
`

// 🔐 SEPARATE USER DATA QUERY - Load role info when needed
const GET_CURRENT_USER_QUERY = gql`
  query GetCurrentUser {
    me {
      id
      email
      firstName
      lastName
      isEmailVerified
      role {
        id
        name
        level
        description
        isActive
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
    }
  }
`

// 🎯 PERMISSIONS QUERY - Optimized with DataLoader batching
const GET_USER_PERMISSIONS_QUERY = gql`
  query GetUserPermissions($userId: UUID!) {
    userPermissions(userId: $userId)
  }
`

/**
 * Optimized Authentication Service
 * Implements the two-phase authentication strategy from FRONTEND_INTEGRATION guide:
 * 1. Fast login with basic user data only (~10-20ms)
 * 2. Lazy loading of permissions/roles when needed
 */
export class AuthService {
  
  /**
   * Fast login - typically 10-20ms
   * Only loads essential user data + tokens for immediate authentication
   */
  async login(email: string, password: string): Promise<AuthUser> {
    const result = await apolloClient.mutate<LoginMutation>({
      mutation: FAST_LOGIN_MUTATION,
      variables: { input: { email, password } }
    })
    
    if (!result.data?.login) {
      throw new Error('Login failed - no data returned')
    }
    
    const { user, accessToken, refreshToken } = result.data.login
    
    // Store tokens immediately for authenticated requests
    tokenManager.setTokens(accessToken, refreshToken)
    
    console.log('✅ Fast login successful - tokens stored')
    
    // Return basic user info - permissions loaded separately
    return user as AuthUser
  }

  /**
   * Get full user profile (called after login or when needed)
   * Includes role data but not permissions for optimal caching
   */
  async getCurrentUser(): Promise<AuthUser> {
    const result = await apolloClient.query<MeQuery>({
      query: GET_CURRENT_USER_QUERY,
      fetchPolicy: 'cache-first',  // Cache user data for performance
      errorPolicy: 'all'
    })
    
    if (!result.data?.me) {
      throw new Error('Could not fetch current user')
    }
    
    console.log('✅ User profile loaded with role data')
    return result.data.me as AuthUser
  }

  /**
   * Load permissions separately (cached by DataLoader on backend)
   * This is where the backend optimization really shines
   */
  async getUserPermissions(userId: string): Promise<string[]> {
    const result = await apolloClient.query<UserPermissionsQuery>({
      query: GET_USER_PERMISSIONS_QUERY,
      variables: { userId },
      fetchPolicy: 'cache-first',  // Cache permissions
      errorPolicy: 'all'
    })
    
    if (!result.data?.userPermissions) {
      console.warn('No permissions returned for user:', userId)
      return []
    }
    
    console.log('✅ User permissions loaded:', result.data.userPermissions.length, 'permissions')
    return result.data.userPermissions
  }

  /**
   * Complete user data (role + permissions) - called when needed
   * Uses Promise.all for parallel loading of user data and permissions
   */
  async getCompleteUserData(userId: string): Promise<AuthUser> {
    const [user, permissions] = await Promise.all([
      this.getCurrentUser(),
      this.getUserPermissions(userId)
    ])
    
    console.log('✅ Complete user data assembled')
    return { ...user, permissions }
  }

  /**
   * Refresh authentication tokens
   * Uses existing refresh token to get new access token
   */
  async refreshTokens(): Promise<{ accessToken: string; refreshToken: string }> {
    const refreshToken = tokenManager.getRefreshToken()
    if (!refreshToken) {
      throw new Error('No refresh token available')
    }

    // Import refresh mutation to avoid circular dependency
    const { REFRESH_TOKEN_MUTATION } = await import('../graphql/mutations')
    
    const result = await apolloClient.mutate({
      mutation: REFRESH_TOKEN_MUTATION,
      variables: { refreshToken },
      context: { skipAuth: true } // Skip auth for this specific request
    })

    if (!result.data?.refreshToken) {
      throw new Error('Token refresh failed')
    }

    const { accessToken: newAccessToken, refreshToken: newRefreshToken } = result.data.refreshToken
    
    // Update stored tokens
    tokenManager.setTokens(newAccessToken, newRefreshToken)
    
    console.log('✅ Tokens refreshed successfully')
    return { accessToken: newAccessToken, refreshToken: newRefreshToken }
  }

  /**
   * Logout user and clear all stored data
   */
  async logout(): Promise<void> {
    try {
      // Optional: Call logout mutation to invalidate server-side session
      const { LOGOUT_MUTATION } = await import('../graphql/mutations')
      await apolloClient.mutate({
        mutation: LOGOUT_MUTATION,
        errorPolicy: 'ignore' // Don't fail logout if mutation fails
      })
    } catch (error) {
      console.warn('Logout mutation failed (continuing anyway):', error)
    }

    // Clear all local data
    tokenManager.clearTokens()
    apolloClient.cache.reset()
    
    console.log('✅ Logout completed - all data cleared')
  }

  /**
   * Check if user is currently authenticated
   */
  isAuthenticated(): boolean {
    return tokenManager.hasTokens()
  }

  /**
   * Get current access token
   */
  getAccessToken(): string | null {
    return tokenManager.getAccessToken()
  }

  /**
   * Get current refresh token
   */
  getRefreshToken(): string | null {
    return tokenManager.getRefreshToken()
  }
}

// Export singleton instance
export const authService = new AuthService()
