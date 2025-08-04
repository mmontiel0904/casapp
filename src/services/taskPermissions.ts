import { permissionService } from '../services/permissions'

/**
 * Task System Permission Service
 * Handles task system specific permission checks following RBAC patterns
 */
export class TaskPermissionService {
  // Task system permissions (resource: "task_system")
  async canCreateProjects(): Promise<boolean> {
    return permissionService.hasPermission('task_system:create')
  }

  async canViewProjects(): Promise<boolean> {
    return permissionService.hasPermission('task_system:read')
  }

  async canEditProjects(): Promise<boolean> {
    return permissionService.hasPermission('task_system:write')
  }

  async canDeleteProjects(): Promise<boolean> {
    return permissionService.hasPermission('task_system:admin')
  }

  async canManageProjectMembers(): Promise<boolean> {
    return permissionService.hasPermission('task_system:user_management')
  }

  // Sync versions (require permissions to be loaded)
  canCreateProjectsSync(): boolean {
    return permissionService.hasPermissionSync('task_system:create')
  }

  canViewProjectsSync(): boolean {
    return permissionService.hasPermissionSync('task_system:read')
  }

  canEditProjectsSync(): boolean {
    return permissionService.hasPermissionSync('task_system:write')
  }

  canDeleteProjectsSync(): boolean {
    return permissionService.hasPermissionSync('task_system:admin')
  }

  canManageProjectMembersSync(): boolean {
    return permissionService.hasPermissionSync('task_system:user_management')
  }

  // Fallback permissions for when task_system permissions aren't set up yet
  // These use role-based checks as temporary measure
  canAccessProjectsBasic(): boolean {
    // All authenticated users can view projects (basic access)
    return permissionService.getUser() !== null
  }

  canCreateProjectsBasic(): boolean {
    // Users with role level 10+ can create projects
    return permissionService.hasRoleLevel(10)
  }

  canManageProjectsBasic(): boolean {
    // Users with role level 25+ can manage projects
    return permissionService.hasRoleLevel(25)
  }

  canAdminProjectsBasic(): boolean {
    // Users with role level 50+ can admin projects
    return permissionService.hasRoleLevel(50)
  }
}

export const taskPermissionService = new TaskPermissionService()