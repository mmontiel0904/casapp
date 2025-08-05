import { computed } from 'vue'
import { 
  useAllRolesQuery,
  useAllRolesWithPermissionsQuery,
  useAllPermissionsQuery,
  useAllResourcesQuery,
  useCreateRoleMutation,
  useUpdateRoleMutation,
  useDeleteRoleMutation,
  useCreatePermissionMutation,
  useUpdatePermissionMutation,
  useDeletePermissionMutation,
  useCreateResourceMutation,
  useUpdateResourceMutation,
  useDeleteResourceMutation,
  useAssignPermissionToRoleMutation,
  useRemovePermissionFromRoleMutation,
  useGrantUserPermissionMutation,
  useRevokeUserPermissionMutation,
  type CreateRoleInput,
  type UpdateRoleInput,
  type CreatePermissionInput,
  type UpdatePermissionInput,
  type CreateResourceInput,
  type UpdateResourceInput
} from '../generated/graphql'
import { useApolloFeedback } from './useApolloFeedback'

/**
 * Composable for managing roles and permissions
 * Provides CRUD operations and role-permission assignments
 */
export function useRolePermissionManagement() {
  const feedback = useApolloFeedback()

  // ========================================
  // QUERIES
  // ========================================

  // Roles
  const { result: rolesResult, loading: rolesLoading, error: rolesError, refetch: refetchRoles } = useAllRolesQuery()
  const { result: rolesWithPermissionsResult, loading: rolesWithPermissionsLoading, error: rolesWithPermissionsError, refetch: refetchRolesWithPermissions } = useAllRolesWithPermissionsQuery()

  // Permissions and Resources
  const { result: permissionsResult, loading: permissionsLoading, error: permissionsError, refetch: refetchPermissions } = useAllPermissionsQuery()
  const { result: resourcesResult, loading: resourcesLoading, error: resourcesError, refetch: refetchResources } = useAllResourcesQuery()

  // ========================================
  // ROLE MUTATIONS
  // ========================================

  const { mutate: createRole, loading: createRoleLoading } = useCreateRoleMutation()
  const { mutate: updateRole, loading: updateRoleLoading } = useUpdateRoleMutation()
  const { mutate: deleteRole, loading: deleteRoleLoading } = useDeleteRoleMutation()

  // ========================================
  // PERMISSION MUTATIONS
  // ========================================

  const { mutate: createPermission, loading: createPermissionLoading } = useCreatePermissionMutation()
  const { mutate: updatePermission, loading: updatePermissionLoading } = useUpdatePermissionMutation()
  const { mutate: deletePermission, loading: deletePermissionLoading } = useDeletePermissionMutation()

  // ========================================
  // RESOURCE MUTATIONS
  // ========================================

  const { mutate: createResource, loading: createResourceLoading } = useCreateResourceMutation()
  const { mutate: updateResource, loading: updateResourceLoading } = useUpdateResourceMutation()
  const { mutate: deleteResource, loading: deleteResourceLoading } = useDeleteResourceMutation()

  // ========================================
  // ROLE-PERMISSION ASSIGNMENT MUTATIONS
  // ========================================

  const { mutate: assignPermissionToRole, loading: assignPermissionLoading } = useAssignPermissionToRoleMutation()
  const { mutate: removePermissionFromRole, loading: removePermissionLoading } = useRemovePermissionFromRoleMutation()

  // ========================================
  // USER-PERMISSION DIRECT ASSIGNMENT MUTATIONS
  // ========================================

  const { mutate: grantUserPermission, loading: grantUserPermissionLoading } = useGrantUserPermissionMutation()
  const { mutate: revokeUserPermission, loading: revokeUserPermissionLoading } = useRevokeUserPermissionMutation()

  // ========================================
  // COMPUTED DATA
  // ========================================

  const roles = computed(() => rolesResult.value?.allRoles || [])
  const rolesWithPermissions = computed(() => rolesWithPermissionsResult.value?.allRolesWithPermissions || [])
  const permissions = computed(() => permissionsResult.value?.allPermissions || [])
  const resources = computed(() => resourcesResult.value?.allResources || [])

  // Loading states
  const isLoading = computed(() => 
    rolesLoading.value || 
    rolesWithPermissionsLoading.value || 
    permissionsLoading.value || 
    resourcesLoading.value
  )

  const isMutating = computed(() =>
    createRoleLoading.value ||
    updateRoleLoading.value ||
    deleteRoleLoading.value ||
    createPermissionLoading.value ||
    updatePermissionLoading.value ||
    deletePermissionLoading.value ||
    createResourceLoading.value ||
    updateResourceLoading.value ||
    deleteResourceLoading.value ||
    assignPermissionLoading.value ||
    removePermissionLoading.value ||
    grantUserPermissionLoading.value ||
    revokeUserPermissionLoading.value
  )

  // Error states
  const hasError = computed(() =>
    rolesError.value ||
    rolesWithPermissionsError.value ||
    permissionsError.value ||
    resourcesError.value
  )

  // ========================================
  // ROLE OPERATIONS
  // ========================================

  const handleCreateRole = async (input: CreateRoleInput) => {
    try {
      const result = await createRole({ input })
      if (result?.data?.createRole) {
        feedback.success('Role Created', `Role "${result.data.createRole.name}" created successfully`)
        await refetchRoles()
        await refetchRolesWithPermissions()
        return result.data.createRole
      }
    } catch (error) {
      feedback.error('Create Role Failed', error instanceof Error ? error.message : 'Failed to create role')
      throw error
    }
  }

  const handleUpdateRole = async (input: UpdateRoleInput) => {
    try {
      const result = await updateRole({ input })
      if (result?.data?.updateRole) {
        feedback.success('Role Updated', `Role "${result.data.updateRole.name}" updated successfully`)
        await refetchRoles()
        await refetchRolesWithPermissions()
        return result.data.updateRole
      }
    } catch (error) {
      feedback.error('Update Role Failed', error instanceof Error ? error.message : 'Failed to update role')
      throw error
    }
  }

  const handleDeleteRole = async (roleId: string, roleName?: string) => {
    try {
      const result = await deleteRole({ roleId })
      if (result?.data?.deleteRole) {
        feedback.success('Role Deleted', roleName ? `Role "${roleName}" deleted successfully` : 'Role deleted successfully')
        await refetchRoles()
        await refetchRolesWithPermissions()
        return result.data.deleteRole
      }
    } catch (error) {
      feedback.error('Delete Role Failed', error instanceof Error ? error.message : 'Failed to delete role')
      throw error
    }
  }

  // ========================================
  // PERMISSION OPERATIONS
  // ========================================

  const handleCreatePermission = async (input: CreatePermissionInput) => {
    try {
      const result = await createPermission({ input })
      if (result?.data?.createPermission) {
        feedback.success('Permission Created', `Permission "${result.data.createPermission.action}" created successfully`)
        await refetchPermissions()
        await refetchRolesWithPermissions()
        return result.data.createPermission
      }
    } catch (error) {
      feedback.error('Create Permission Failed', error instanceof Error ? error.message : 'Failed to create permission')
      throw error
    }
  }

  const handleUpdatePermission = async (input: UpdatePermissionInput) => {
    try {
      const result = await updatePermission({ input })
      if (result?.data?.updatePermission) {
        feedback.success('Permission Updated', `Permission "${result.data.updatePermission.action}" updated successfully`)
        await refetchPermissions()
        await refetchRolesWithPermissions()
        return result.data.updatePermission
      }
    } catch (error) {
      feedback.error('Update Permission Failed', error instanceof Error ? error.message : 'Failed to update permission')
      throw error
    }
  }

  const handleDeletePermission = async (permissionId: string, permissionAction?: string) => {
    try {
      const result = await deletePermission({ permissionId })
      if (result?.data?.deletePermission) {
        feedback.success('Permission Deleted', permissionAction ? `Permission "${permissionAction}" deleted successfully` : 'Permission deleted successfully')
        await refetchPermissions()
        await refetchRolesWithPermissions()
        return result.data.deletePermission
      }
    } catch (error) {
      feedback.error('Delete Permission Failed', error instanceof Error ? error.message : 'Failed to delete permission')
      throw error
    }
  }

  // ========================================
  // RESOURCE OPERATIONS
  // ========================================

  const handleCreateResource = async (input: CreateResourceInput) => {
    try {
      const result = await createResource({ input })
      if (result?.data?.createResource) {
        feedback.success('Resource Created', `Resource "${result.data.createResource.name}" created successfully`)
        await refetchResources()
        return result.data.createResource
      }
    } catch (error) {
      feedback.error('Create Resource Failed', error instanceof Error ? error.message : 'Failed to create resource')
      throw error
    }
  }

  const handleUpdateResource = async (input: UpdateResourceInput) => {
    try {
      const result = await updateResource({ input })
      if (result?.data?.updateResource) {
        feedback.success('Resource Updated', `Resource "${result.data.updateResource.name}" updated successfully`)
        await refetchResources()
        return result.data.updateResource
      }
    } catch (error) {
      feedback.error('Update Resource Failed', error instanceof Error ? error.message : 'Failed to update resource')
      throw error
    }
  }

  const handleDeleteResource = async (resourceId: string, resourceName?: string) => {
    try {
      const result = await deleteResource({ resourceId })
      if (result?.data?.deleteResource) {
        feedback.success('Resource Deleted', resourceName ? `Resource "${resourceName}" deleted successfully` : 'Resource deleted successfully')
        await refetchResources()
        return result.data.deleteResource
      }
    } catch (error) {
      feedback.error('Delete Resource Failed', error instanceof Error ? error.message : 'Failed to delete resource')
      throw error
    }
  }

  // ========================================
  // ROLE-PERMISSION ASSIGNMENT OPERATIONS
  // ========================================

  const handleAssignPermissionToRole = async (roleId: string, permissionId: string) => {
    try {
      const result = await assignPermissionToRole({ input: { roleId, permissionId } })
      if (result?.data?.assignPermissionToRole) {
        feedback.success('Permission Assigned', 'Permission assigned to role successfully')
        await refetchRolesWithPermissions()
        return result.data.assignPermissionToRole
      }
    } catch (error) {
      feedback.error('Assign Permission Failed', error instanceof Error ? error.message : 'Failed to assign permission to role')
      throw error
    }
  }

  const handleRemovePermissionFromRole = async (roleId: string, permissionId: string) => {
    try {
      const result = await removePermissionFromRole({ input: { roleId, permissionId } })
      if (result?.data?.removePermissionFromRole) {
        feedback.success('Permission Removed', 'Permission removed from role successfully')
        await refetchRolesWithPermissions()
        return result.data.removePermissionFromRole
      }
    } catch (error) {
      feedback.error('Remove Permission Failed', error instanceof Error ? error.message : 'Failed to remove permission from role')
      throw error
    }
  }

  // ========================================
  // USER-PERMISSION DIRECT ASSIGNMENT OPERATIONS
  // ========================================

  const handleGrantUserPermission = async (userId: string, permissionId: string) => {
    try {
      const result = await grantUserPermission({ input: { userId, permissionId } })
      if (result?.data?.grantUserPermission) {
        feedback.success('Permission Granted', 'Permission granted to user successfully')
        return result.data.grantUserPermission
      }
    } catch (error) {
      feedback.error('Grant Permission Failed', error instanceof Error ? error.message : 'Failed to grant permission to user')
      throw error
    }
  }

  const handleRevokeUserPermission = async (userId: string, permissionId: string) => {
    try {
      const result = await revokeUserPermission({ input: { userId, permissionId } })
      if (result?.data?.revokeUserPermission) {
        feedback.success('Permission Revoked', 'Permission revoked from user successfully')
        return result.data.revokeUserPermission
      }
    } catch (error) {
      feedback.error('Revoke Permission Failed', error instanceof Error ? error.message : 'Failed to revoke permission from user')
      throw error
    }
  }

  // ========================================
  // UTILITY METHODS
  // ========================================

  const refetchAll = async () => {
    await Promise.all([
      refetchRoles(),
      refetchRolesWithPermissions(),
      refetchPermissions(),
      refetchResources()
    ])
  }

  const getPermissionsByResource = (resourceId: string) => {
    return permissions.value.filter(p => p.resourceId === resourceId)
  }

  const getRolePermissions = (roleId: string) => {
    const role = rolesWithPermissions.value.find(r => r.id === roleId)
    return role?.permissions || []
  }

  const isPermissionAssignedToRole = (roleId: string, permissionId: string) => {
    const rolePermissions = getRolePermissions(roleId)
    return rolePermissions.some(p => p.id === permissionId)
  }

  return {
    // Data
    roles,
    rolesWithPermissions,
    permissions,
    resources,

    // Loading states
    isLoading,
    isMutating,
    hasError,

    // Role operations
    handleCreateRole,
    handleUpdateRole,
    handleDeleteRole,

    // Permission operations
    handleCreatePermission,
    handleUpdatePermission,
    handleDeletePermission,

    // Resource operations
    handleCreateResource,
    handleUpdateResource,
    handleDeleteResource,

    // Assignment operations
    handleAssignPermissionToRole,
    handleRemovePermissionFromRole,
    handleGrantUserPermission,
    handleRevokeUserPermission,

    // Utility methods
    refetchAll,
    getPermissionsByResource,
    getRolePermissions,
    isPermissionAssignedToRole
  }
}
