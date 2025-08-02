import type { User, Role } from '../generated/graphql'

// Enhanced AuthUser interface with RBAC data
export interface AuthUser extends User {
  role?: Role | null
  permissions?: string[]
}

// Permission checking service following API spec
export class PermissionService {
  private user: AuthUser | null = null

  setUser(user: AuthUser) {
    this.user = user
  }

  getUser(): AuthUser | null {
    return this.user
  }

  clearUser() {
    this.user = null
  }

  // Check if user has specific permission
  hasPermission(action: string): boolean {
    if (!this.user || !this.user.permissions) return false
    return this.user.permissions.includes(action)
  }

  // Check if user has minimum role level
  hasRoleLevel(minLevel: number): boolean {
    if (!this.user?.role) return false
    return this.user.role.level >= minLevel
  }

  // Role-based checks
  isSuperAdmin(): boolean {
    return this.user?.role?.name === 'super_admin'
  }

  isAdmin(): boolean {
    return this.hasRoleLevel(50) // admin level or higher
  }

  isManager(): boolean {
    return this.hasRoleLevel(25) // manager level or higher
  }

  // Permission-based checks following API spec
  canInviteUsers(): boolean {
    return this.hasPermission('invite_users')
  }

  canManageUsers(): boolean {
    return this.hasPermission('user_management')
  }

  canAdminSystem(): boolean {
    return this.hasPermission('system_admin')
  }

  canAssignRoles(): boolean {
    return this.hasPermission('assign_roles') || this.isSuperAdmin()
  }

  canViewAllUsers(): boolean {
    return this.hasPermission('view_users') || this.isAdmin()
  }

  canEditUserRoles(): boolean {
    return this.hasPermission('edit_user_roles') || this.isSuperAdmin()
  }

  // Check if user can assign a specific role (role hierarchy protection)
  canAssignRole(targetRole: Role): boolean {
    if (!this.canAssignRoles()) return false
    if (this.isSuperAdmin()) return true // Super admin can assign any role
    
    // Users can only assign roles at their level or below
    const currentUserLevel = this.user?.role?.level || 0
    return targetRole.level <= currentUserLevel
  }

  // Check if user can manage another user (hierarchy protection)
  canManageUser(targetUser: AuthUser): boolean {
    if (!this.canManageUsers()) return false
    if (this.isSuperAdmin()) return true // Super admin can manage anyone
    
    // Users cannot manage users with equal or higher role levels
    const currentUserLevel = this.user?.role?.level || 0
    const targetUserLevel = targetUser.role?.level || 0
    return currentUserLevel > targetUserLevel
  }
}

// Global permission service instance
export const permissionService = new PermissionService()