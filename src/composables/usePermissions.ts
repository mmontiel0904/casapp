import { computed, ref } from 'vue'
import { permissionService, type AuthUser } from '../services/permissions'
import type { Role } from '../generated/graphql'

export function usePermissions() {
  const user = ref<AuthUser | null>(permissionService.getUser())

  // Update user and sync with permission service
  const setUser = (newUser: AuthUser | null) => {
    user.value = newUser
    if (newUser) {
      permissionService.setUser(newUser)
    } else {
      permissionService.clearUser()
    }
  }

  // Basic permission checks
  const hasPermission = (action: string) => {
    return computed(() => permissionService.hasPermission(action))
  }

  const hasRoleLevel = (minLevel: number) => {
    return computed(() => permissionService.hasRoleLevel(minLevel))
  }

  // Role-based computed properties
  const isSuperAdmin = computed(() => permissionService.isSuperAdmin())
  const isAdmin = computed(() => permissionService.isAdmin())
  const isManager = computed(() => permissionService.isManager())

  // Permission-based computed properties
  const canInviteUsers = computed(() => permissionService.canInviteUsers())
  const canManageUsers = computed(() => permissionService.canManageUsers())
  const canAdminSystem = computed(() => permissionService.canAdminSystem())
  const canAssignRoles = computed(() => permissionService.canAssignRoles())
  const canViewAllUsers = computed(() => permissionService.canViewAllUsers())
  const canEditUserRoles = computed(() => permissionService.canEditUserRoles())

  // Dynamic permission checks
  const canAssignRole = (targetRole: Role): boolean => {
    return permissionService.canAssignRole(targetRole)
  }

  const canManageUser = (targetUser: AuthUser): boolean => {
    return permissionService.canManageUser(targetUser)
  }

  // Current user info
  const currentUserRole = computed(() => user.value?.role)
  const currentUserLevel = computed(() => user.value?.role?.level || 0)
  const userPermissions = computed(() => user.value?.permissions || [])

  return {
    // User state
    user: computed(() => user.value),
    currentUserRole,
    currentUserLevel,
    userPermissions,
    setUser,

    // Permission checking functions
    hasPermission,
    hasRoleLevel,
    canAssignRole,
    canManageUser,

    // Role-based checks
    isSuperAdmin,
    isAdmin,
    isManager,

    // Permission-based checks
    canInviteUsers,
    canManageUsers,
    canAdminSystem,
    canAssignRoles,
    canViewAllUsers,
    canEditUserRoles
  }
}