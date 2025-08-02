import { permissionService } from '../services/permissions'
import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router'

// Permission-based route guard
export function requirePermission(permission: string) {
  return (_to: RouteLocationNormalized, _from: RouteLocationNormalized, next: NavigationGuardNext) => {
    if (permissionService.hasPermission(permission)) {
      next()
    } else {
      // Redirect to dashboard with error message
      next({ 
        path: '/', 
        query: { error: 'insufficient_permissions' }
      })
    }
  }
}

// Role level-based route guard
export function requireRoleLevel(minLevel: number) {
  return (_to: RouteLocationNormalized, _from: RouteLocationNormalized, next: NavigationGuardNext) => {
    if (permissionService.hasRoleLevel(minLevel)) {
      next()
    } else {
      next({ 
        path: '/', 
        query: { error: 'insufficient_role' }
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

// Combined auth + permission guard
export function requireAuthAndPermission(permission: string) {
  return (_to: RouteLocationNormalized, _from: RouteLocationNormalized, next: NavigationGuardNext) => {
    // First check if user is authenticated (this will be handled by main auth guard)
    // Then check permission
    if (permissionService.hasPermission(permission)) {
      next()
    } else {
      next({ 
        path: '/', 
        query: { error: 'access_denied' }
      })
    }
  }
}