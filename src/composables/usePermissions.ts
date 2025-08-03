import { computed, ref, onMounted } from 'vue'
import { permissionService, type AuthUser } from '../services/permissions'
import type { Role } from '../generated/graphql'

/**
 * Enhanced usePermissions composable with lazy loading and caching
 * Implements the optimized RBAC patterns from FRONTEND_INTEGRATION guide
 */
export function usePermissions() {
  const user = ref<AuthUser | null>(permissionService.getUser())
  const permissionsLoaded = ref(permissionService.arePermissionsLoaded())
  const permissionsLoading = ref(false)

  // Update user and sync with permission service
  const setUser = (newUser: AuthUser | null) => {
    user.value = newUser
    if (newUser) {
      permissionService.setUser(newUser)
    } else {
      permissionService.clearUser()
    }
    // Update loaded state
    permissionsLoaded.value = permissionService.arePermissionsLoaded()
  }

  // ========================================
  // FAST ROLE-BASED CHECKS (No async needed)
  // ========================================

  const hasRoleLevel = (minLevel: number) => {
    return computed(() => permissionService.hasRoleLevel(minLevel))
  }

  const isAdmin = computed(() => permissionService.isAdmin())
  const isSuperAdmin = computed(() => permissionService.isSuperAdmin())
  const isManager = computed(() => permissionService.isManager())

  // ========================================
  // PERMISSION CHECKS (Sync - after preload)
  // ========================================

  const hasPermissionSync = (action: string) => {
    return computed(() => 
      permissionsLoaded.value && permissionService.hasPermissionSync(action)
    )
  }

  // Computed permission checks (reactive)
  const canInviteUsers = computed(() => 
    permissionsLoaded.value && permissionService.canInviteUsersSync()
  )
  
  const canManageUsers = computed(() => 
    permissionsLoaded.value && permissionService.canManageUsersSync()
  )

  const canAdminSystem = computed(() => 
    permissionsLoaded.value && permissionService.canAdminSystemSync()
  )

  const canAssignRoles = computed(() => 
    permissionsLoaded.value && permissionService.canAssignRolesSync()
  )

  const canViewAllUsers = computed(() => 
    permissionsLoaded.value && permissionService.canViewAllUsersSync()
  )

  const canEditUserRoles = computed(() => 
    permissionsLoaded.value && permissionService.canEditUserRolesSync()
  )

  // ========================================
  // ASYNC PERMISSION LOADING
  // ========================================

  /**
   * Load permissions in background for instant sync checks
   */
  const loadPermissions = async (): Promise<void> => {
    if (permissionsLoaded.value || permissionsLoading.value) return
    
    permissionsLoading.value = true
    try {
      await permissionService.preloadPermissions()
      permissionsLoaded.value = true
      console.log('✅ Permissions preloaded for instant checks')
    } catch (error) {
      console.warn('⚠️ Could not preload permissions:', error)
    } finally {
      permissionsLoading.value = false
    }
  }

  /**
   * Force refresh permissions (clears cache and reloads)
   */
  const refreshPermissions = async (): Promise<void> => {
    permissionService.clearCache()
    permissionsLoaded.value = false
    await loadPermissions()
  }

  // ========================================
  // ASYNC PERMISSION CHECKS (When needed)
  // ========================================

  /**
   * Async permission check - automatically loads permissions if needed
   */
  const hasPermission = async (action: string): Promise<boolean> => {
    try {
      return await permissionService.hasPermission(action)
    } catch (error) {
      console.warn('Permission check failed for', action, error)
      return false
    }
  }

  // ========================================
  // HIERARCHY-BASED PERMISSION CHECKS
  // ========================================

  /**
   * Check if user can assign a specific role
   */
  const canAssignRole = (targetRole: Role): boolean => {
    return permissionService.canAssignRole(targetRole)
  }

  /**
   * Check if user can manage another user
   */
  const canManageUser = (targetUser: AuthUser): boolean => {
    return permissionService.canManageUser(targetUser)
  }

  // ========================================
  // USER INFO COMPUTED PROPERTIES
  // ========================================

  const currentUserRole = computed(() => user.value?.role)
  const currentUserLevel = computed(() => permissionService.getCurrentUserLevel())
  const currentUserRoleName = computed(() => permissionService.getCurrentUserRole())
  const userPermissions = computed(() => permissionService.getCachedPermissions() || [])

  // ========================================
  // AUTO-LOADING ON MOUNT
  // ========================================

  // Auto-load permissions when composable is used and user exists
  onMounted(() => {
    if (user.value && !permissionsLoaded.value) {
      loadPermissions()
    }
  })

  // ========================================
  // UTILITY METHODS
  // ========================================

  /**
   * Check multiple permissions at once (async)
   */
  const hasAnyPermission = async (permissions: string[]): Promise<boolean> => {
    try {
      const results = await Promise.all(
        permissions.map(permission => permissionService.hasPermission(permission))
      )
      return results.some(result => result)
    } catch (error) {
      console.warn('Multiple permission check failed:', error)
      return false
    }
  }

  /**
   * Check multiple permissions at once (sync)
   */
  const hasAnyPermissionSync = (permissions: string[]): boolean => {
    if (!permissionsLoaded.value) return false
    return permissions.some(permission => permissionService.hasPermissionSync(permission))
  }

  /**
   * Get permission loading status for UI feedback
   */
  const getPermissionStatus = () => {
    return {
      loaded: permissionsLoaded.value,
      loading: permissionsLoading.value,
      count: userPermissions.value.length
    }
  }

  return {
    // ========================================
    // STATE
    // ========================================
    user: computed(() => user.value),
    currentUserRole,
    currentUserLevel,
    currentUserRoleName,
    userPermissions,
    permissionsLoaded: computed(() => permissionsLoaded.value),
    permissionsLoading: computed(() => permissionsLoading.value),
    
    // ========================================
    // USER MANAGEMENT
    // ========================================
    setUser,

    // ========================================
    // PERMISSION CHECKING FUNCTIONS
    // ========================================
    
    // Fast role checks
    hasRoleLevel,
    isAdmin,
    isSuperAdmin,
    isManager,
    
    // Sync permission checks (after preload)
    hasPermissionSync,
    hasAnyPermissionSync,
    
    // Async permission checks
    hasPermission,
    hasAnyPermission,
    
    // Specific permission checks (reactive)
    canInviteUsers,
    canManageUsers,
    canAdminSystem,
    canAssignRoles,
    canViewAllUsers,
    canEditUserRoles,
    
    // Hierarchy checks
    canAssignRole,
    canManageUser,

    // ========================================
    // ACTIONS
    // ========================================
    loadPermissions,
    refreshPermissions,
    getPermissionStatus
  }
}