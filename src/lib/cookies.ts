// Cookie management utilities for secure token storage

export interface CookieOptions {
  expires?: Date
  maxAge?: number
  domain?: string
  path?: string
  secure?: boolean
  httpOnly?: boolean
  sameSite?: 'strict' | 'lax' | 'none'
}

// Set a cookie with security options
export function setCookie(name: string, value: string, options: CookieOptions = {}): void {
  const defaults: CookieOptions = {
    path: '/',
    secure: window.location.protocol === 'https:',
    sameSite: 'lax'
  }
  
  const opts = { ...defaults, ...options }
  let cookieString = `${name}=${encodeURIComponent(value)}`
  
  if (opts.expires) {
    cookieString += `; expires=${opts.expires.toUTCString()}`
  }
  
  if (opts.maxAge) {
    cookieString += `; max-age=${opts.maxAge}`
  }
  
  if (opts.domain) {
    cookieString += `; domain=${opts.domain}`
  }
  
  if (opts.path) {
    cookieString += `; path=${opts.path}`
  }
  
  if (opts.secure) {
    cookieString += '; secure'
  }
  
  if (opts.httpOnly) {
    cookieString += '; httponly'
  }
  
  if (opts.sameSite) {
    cookieString += `; samesite=${opts.sameSite}`
  }
  
  document.cookie = cookieString
}

// Get cookie value by name
export function getCookie(name: string): string | null {
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  
  if (parts.length === 2) {
    const cookieValue = parts.pop()?.split(';').shift()
    return cookieValue ? decodeURIComponent(cookieValue) : null
  }
  
  return null
}

// Remove a cookie
export function removeCookie(name: string, options: Omit<CookieOptions, 'expires' | 'maxAge'> = {}): void {
  setCookie(name, '', {
    ...options,
    expires: new Date(0)
  })
}

// Check if cookies are enabled
export function areCookiesEnabled(): boolean {
  const testCookie = '__cookie_test__'
  setCookie(testCookie, 'test')
  const enabled = getCookie(testCookie) === 'test'
  if (enabled) {
    removeCookie(testCookie)
  }
  return enabled
}

// Token-specific cookie management
export class TokenCookieManager {
  private readonly ACCESS_TOKEN_KEY = 'cas_access_token'
  private readonly REFRESH_TOKEN_KEY = 'cas_refresh_token'
  
  // Store tokens securely
  setTokens(accessToken: string, refreshToken: string): void {
    const isSecure = window.location.protocol === 'https:'
    
    // Access token - shorter expiry (15 minutes)
    setCookie(this.ACCESS_TOKEN_KEY, accessToken, {
      maxAge: 15 * 60, // 15 minutes
      secure: isSecure,
      sameSite: 'lax'
    })
    
    // Refresh token - longer expiry (7 days)
    setCookie(this.REFRESH_TOKEN_KEY, refreshToken, {
      maxAge: 7 * 24 * 60 * 60, // 7 days
      secure: isSecure,
      sameSite: 'lax'
    })
    
    // Also store in localStorage as fallback
    localStorage.setItem('auth_token', accessToken)
    localStorage.setItem('refresh_token', refreshToken)
  }
  
  // Get access token
  getAccessToken(): string | null {
    return getCookie(this.ACCESS_TOKEN_KEY) || localStorage.getItem('auth_token')
  }
  
  // Get refresh token
  getRefreshToken(): string | null {
    return getCookie(this.REFRESH_TOKEN_KEY) || localStorage.getItem('refresh_token')
  }
  
  // Clear all tokens
  clearTokens(): void {
    removeCookie(this.ACCESS_TOKEN_KEY)
    removeCookie(this.REFRESH_TOKEN_KEY)
    localStorage.removeItem('auth_token')
    localStorage.removeItem('refresh_token')
  }
  
  // Check if tokens exist
  hasTokens(): boolean {
    return !!(this.getAccessToken() && this.getRefreshToken())
  }
}

export const tokenManager = new TokenCookieManager()