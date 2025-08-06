import type { User, Role } from '../generated/graphql'
import { authService } from './auth'

// Enhanced AuthUser interface with RBAC data
// Note: Using intersection instead of extends to allow optional permissions
export type AuthUser = Omit<User, 'permissions'> & {
  role?: Role | null
  permissions?: string[]  // Optional - loaded separately for performance
}

/**
 * Enhanced Permission Service with lazy loading and caching
 * Implements the optimized permission checking from FRONTEND_INTEGRATION guide
 */
export class PermissionService {
  private user: AuthUser | null = null
  private permissionsCache: string[] | null = null
  private permissionsPromise: Promise<string[]> | null = null

  setUser(user: AuthUser) {
    const previousUserId = this.user?.id
    this.user = user
    
    // If this is a different user, clear permissions cache
    if (previousUserId && previousUserId !== user.id) {
      this.permissionsCache = null
      this.permissionsPromise = null
    }
    // If this is the same user with updated permissions, update the cache
    else if (user.permissions && user.permissions.length > 0) {
      this.permissionsCache = user.permissions
    }
    // If this is the same user but no permissions in user object, keep existing cache if available
    else if (!user.permissions && this.permissionsCache) {
      // Keep existing cache
    }
    // Otherwise, clear cache to force reload
    else {
      this.permissionsCache = null
      this.permissionsPromise = null
    }
  }

  getUser(): AuthUser | null {
    return this.user
  }

  clearUser() {
    this.user = null
    this.permissionsCache = null
    this.permissionsPromise = null
  }

  /**
   * Lazy load permissions with caching
   * Prevents multiple simultaneous permission requests
   */
  private async getPermissions(): Promise<string[]> {
    if (this.permissionsCache) {
      return this.permissionsCache
    }

    if (this.permissionsPromise) {
      return this.permissionsPromise
    }

    if (!this.user?.id) {
      return []
    }

    this.permissionsPromise = authService.getUserPermissions(this.user.id)
    this.permissionsCache = await this.permissionsPromise
    return this.permissionsCache
  }

  /**
   * Check if user has specific permission (async for first load)
   * API returns exact action strings like: "task_read", "project_admin", "user_management"
   * Admin users get automatic access via role level
   */
  async hasPermission(action: string): Promise<boolean> {
    if (!this.user) return false
    
    // Admin users get automatic access to basic operations
    if (this.isAdmin()) {
      return true
    }
    
    const permissions = await this.getPermissions()
    
    // Exact match - API returns action strings like "task_read", "project_admin"
    return permissions.includes(action)
  }

  /**
   * Sync permission check (requires permissions to be loaded)
   * Use this for instant checks after permissions are preloaded
   */
  hasPermissionSync(action: string): boolean {
    if (!this.user) return false
    
    // Admin users get automatic access
    if (this.isAdmin()) {
      return true
    }
    
    if (!this.permissionsCache) return false
    
    // Exact match - API returns action strings like "task_read", "project_admin"
    return this.permissionsCache.includes(action)
  }

  /**
   * Check if user has minimum role level (fast - no async needed)
   * Role checks are instant since role data is loaded with user
   */
  hasRoleLevel(minLevel: number): boolean {
    if (!this.user?.role) return false
    return this.user.role.level >= minLevel
  }

  /**
   * Preload permissions for instant sync checks
   * Call this to warm the cache for faster subsequent checks
   */
  async preloadPermissions(): Promise<void> {
    await this.getPermissions()
  }

  /**
   * Clear cache when permissions might have changed
   * Call this after role assignments or permission updates
   */
  clearCache(): void {
    this.permissionsCache = null
    this.permissionsPromise = null
  }

  // ========================================
  // ROLE-BASED CHECKS (Fast - no async needed)
  // ========================================

  isSuperAdmin(): boolean {
    return this.user?.role?.name === 'super_admin'
  }

  isAdmin(): boolean {
    return this.hasRoleLevel(50) // admin level or higher
  }

  isManager(): boolean {
    return this.hasRoleLevel(25) // manager level or higher
  }

  // ========================================
  // PERMISSION-BASED CHECKS (Async)
  // ========================================

  async canInviteUsers(): Promise<boolean> {
    return this.hasPermission('invite_users')
  }

  async canManageUsers(): Promise<boolean> {
    return this.hasPermission('user_management')
  }

  async canAdminSystem(): Promise<boolean> {
    return this.hasPermission('system_admin')
  }

  async canAssignRoles(): Promise<boolean> {
    return this.hasPermission('assign_roles') || this.isSuperAdmin()
  }

  async canViewAllUsers(): Promise<boolean> {
    return this.hasPermission('view_users') || this.isAdmin()
  }

  async canEditUserRoles(): Promise<boolean> {
    return this.hasPermission('edit_user_roles') || this.isSuperAdmin()
  }

  // ========================================
  // TASK SYSTEM PERMISSIONS (Async)
  // ========================================

  async canAccessTasks(): Promise<boolean> {
    return this.hasPermission('task_read') || this.isAdmin()
  }

  async canCreateTasks(): Promise<boolean> {
    return this.hasPermission('task_create') || this.isAdmin()
  }

  async canManageTasks(): Promise<boolean> {
    return this.hasPermission('task_write') || this.hasPermission('task_delete') || this.hasPermission('task_assign') || this.isAdmin()
  }

  async canAccessProjects(): Promise<boolean> {
    return this.hasPermission('project_read') || this.isAdmin()
  }

  // ========================================
  // PERMISSION-BASED CHECKS (Sync - after preload)
  // ========================================

  canInviteUsersSync(): boolean {
    return this.hasPermissionSync('invite_users')
  }

  canManageUsersSync(): boolean {
    return this.hasPermissionSync('user_management')
  }

  canAdminSystemSync(): boolean {
    return this.hasPermissionSync('system_admin')
  }

  canAssignRolesSync(): boolean {
    return this.hasPermissionSync('assign_roles') || this.isSuperAdmin()
  }

  canViewAllUsersSync(): boolean {
    return this.hasPermissionSync('view_users') || this.isAdmin()
  }

  canEditUserRolesSync(): boolean {
    return this.hasPermissionSync('edit_user_roles') || this.isSuperAdmin()
  }

  // ========================================
  // TASK SYSTEM PERMISSIONS (Sync)
  // ========================================

  canAccessTasksSync(): boolean {
    return this.hasPermissionSync('task_read') || this.isAdmin()
  }

  canCreateTasksSync(): boolean {
    return this.hasPermissionSync('task_create') || this.isAdmin()
  }

  canManageTasksSync(): boolean {
    return this.hasPermissionSync('task_write') || this.hasPermissionSync('task_delete') || this.hasPermissionSync('task_assign') || this.isAdmin()
  }

  canAccessProjectsSync(): boolean {
    return this.hasPermissionSync('project_read') || this.isAdmin()
  }

  // ========================================
  // HIERARCHY-BASED PERMISSION CHECKS
  // ========================================

  /**
   * Check if user can assign a specific role (role hierarchy protection)
   */
  canAssignRole(targetRole: Role): boolean {
    if (!this.canAssignRolesSync()) return false
    if (this.isSuperAdmin()) return true // Super admin can assign any role
    
    // Users can only assign roles at their level or below
    const currentUserLevel = this.user?.role?.level || 0
    return targetRole.level <= currentUserLevel
  }

  /**
   * Check if user can manage another user (hierarchy protection)
   */
  canManageUser(targetUser: AuthUser): boolean {
    if (!this.canManageUsersSync()) return false
    if (this.isSuperAdmin()) return true // Super admin can manage anyone
    
    // Users cannot manage users with equal or higher role levels
    const currentUserLevel = this.user?.role?.level || 0
    const targetUserLevel = targetUser.role?.level || 0
    return currentUserLevel > targetUserLevel
  }

  // ========================================
  // UTILITY METHODS
  // ========================================

  /**
   * Get all cached permissions (if loaded)
   */
  getCachedPermissions(): string[] | null {
    return this.permissionsCache
  }

  /**
   * Check if permissions are loaded
   */
  arePermissionsLoaded(): boolean {
    return this.permissionsCache !== null
  }

  /**
   * Get current user's role level
   */
  getCurrentUserLevel(): number {
    return this.user?.role?.level || 0
  }

  /**
   * Get current user's role name
   */
  getCurrentUserRole(): string | null {
    return this.user?.role?.name || null
  }
}

// Global permission service instance
export const permissionService = new PermissionService()