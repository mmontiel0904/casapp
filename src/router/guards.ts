import { permissionService } from '../services/permissions'
import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router'

// Async permission-based route guard (recommended)
export function requirePermission(permission: string) {
  return async (_to: RouteLocationNormalized, _from: RouteLocationNormalized, next: NavigationGuardNext) => {
    try {
      const hasPermission = await permissionService.hasPermission(permission)
      if (hasPermission) {
        next()
      } else {
        // Redirect to dashboard with error message
        next({ 
          path: '/', 
          query: { error: 'insufficient_permissions', required: permission }
        })
      }
    } catch (error) {
      console.error('Permission check failed:', error)
      next({ 
        path: '/', 
        query: { error: 'permission_check_failed' }
      })
    }
  }
}

// Sync permission-based route guard (use only if permissions are preloaded)
export function requirePermissionSync(permission: string) {
  return (_to: RouteLocationNormalized, _from: RouteLocationNormalized, next: NavigationGuardNext) => {
    if (permissionService.hasPermissionSync(permission)) {
      next()
    } else {
      // Redirect to dashboard with error message
      next({ 
        path: '/', 
        query: { error: 'insufficient_permissions', required: permission }
      })
    }
  }
}

// Role level-based route guard (fast - no async needed)
export function requireRoleLevel(minLevel: number) {
  return (_to: RouteLocationNormalized, _from: RouteLocationNormalized, next: NavigationGuardNext) => {
    if (permissionService.hasRoleLevel(minLevel)) {
      next()
    } else {
      next({ 
        path: '/', 
        query: { error: 'insufficient_role', required_level: minLevel.toString() }
      })
    }
  }
}

// Admin role guard (convenience function)
export function requireAdmin() {
  return requireRoleLevel(50) // Admin level or higher
}

// Super admin guard (convenience function)
export function requireSuperAdmin() {
  return (_to: RouteLocationNormalized, _from: RouteLocationNormalized, next: NavigationGuardNext) => {
    if (permissionService.isSuperAdmin()) {
      next()
    } else {
      next({ 
        path: '/', 
        query: { error: 'super_admin_required' }
      })
    }
  }
}

// Combined auth + permission guard with preloading
export function requireAuthAndPermission(permission: string) {
  return async (_to: RouteLocationNormalized, _from: RouteLocationNormalized, next: NavigationGuardNext) => {
    try {
      // First preload permissions if not loaded
      if (!permissionService.arePermissionsLoaded()) {
        await permissionService.preloadPermissions()
      }
      
      // Then check permission
      if (permissionService.hasPermissionSync(permission)) {
        next()
      } else {
        next({ 
          path: '/', 
          query: { error: 'access_denied', required: permission }
        })
      }
    } catch (error) {
      console.error('Auth + permission check failed:', error)
      next({ 
        path: '/', 
        query: { error: 'auth_check_failed' }
      })
    }
  }
}