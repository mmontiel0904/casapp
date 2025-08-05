import { gql } from 'graphql-tag'

// ========================================
// ROLE QUERIES
// ========================================

export const ALL_ROLES_QUERY = gql`
  query AllRoles {
    allRoles {
      id
      name
      level
      description
      isActive
      createdAt
      updatedAt
    }
  }
`

export const ALL_ROLES_WITH_PERMISSIONS_QUERY = gql`
  query AllRolesWithPermissions {
    allRolesWithPermissions {
      id
      name
      level
      description
      isActive
      userCount
      permissions {
        id
        action
        description
        resourceName
        resourceId
        isActive
      }
      createdAt
      updatedAt
    }
  }
`

// ========================================
// PERMISSION QUERIES
// ========================================

export const ALL_PERMISSIONS_QUERY = gql`
  query AllPermissions($resourceId: UUID) {
    allPermissions(resourceId: $resourceId) {
      id
      action
      description
      resourceName
      resourceId
      isActive
      resource {
        id
        name
        description
      }
      createdAt
      updatedAt
    }
  }
`

export const ALL_RESOURCES_QUERY = gql`
  query AllResources {
    allResources {
      id
      name
      description
      isActive
      createdAt
      updatedAt
    }
  }
`

// ========================================
// ROLE MUTATIONS
// ========================================

export const CREATE_ROLE_MUTATION = gql`
  mutation CreateRole($input: CreateRoleInput!) {
    createRole(input: $input) {
      id
      name
      level
      description
      isActive
      createdAt
      updatedAt
    }
  }
`

export const UPDATE_ROLE_MUTATION = gql`
  mutation UpdateRole($input: UpdateRoleInput!) {
    updateRole(input: $input) {
      id
      name
      level
      description
      isActive
      createdAt
      updatedAt
    }
  }
`

export const DELETE_ROLE_MUTATION = gql`
  mutation DeleteRole($roleId: UUID!) {
    deleteRole(roleId: $roleId) {
      message
    }
  }
`

// ========================================
// PERMISSION MUTATIONS
// ========================================

export const CREATE_PERMISSION_MUTATION = gql`
  mutation CreatePermission($input: CreatePermissionInput!) {
    createPermission(input: $input) {
      id
      action
      description
      resourceName
      resourceId
      isActive
      resource {
        id
        name
        description
      }
      createdAt
      updatedAt
    }
  }
`

export const UPDATE_PERMISSION_MUTATION = gql`
  mutation UpdatePermission($input: UpdatePermissionInput!) {
    updatePermission(input: $input) {
      id
      action
      description
      resourceName
      resourceId
      isActive
      resource {
        id
        name
        description
      }
      createdAt
      updatedAt
    }
  }
`

export const DELETE_PERMISSION_MUTATION = gql`
  mutation DeletePermission($permissionId: UUID!) {
    deletePermission(permissionId: $permissionId) {
      message
    }
  }
`

// ========================================
// RESOURCE MUTATIONS
// ========================================

export const CREATE_RESOURCE_MUTATION = gql`
  mutation CreateResource($input: CreateResourceInput!) {
    createResource(input: $input) {
      id
      name
      description
      isActive
      createdAt
      updatedAt
    }
  }
`

export const UPDATE_RESOURCE_MUTATION = gql`
  mutation UpdateResource($input: UpdateResourceInput!) {
    updateResource(input: $input) {
      id
      name
      description
      isActive
      createdAt
      updatedAt
    }
  }
`

export const DELETE_RESOURCE_MUTATION = gql`
  mutation DeleteResource($resourceId: UUID!) {
    deleteResource(resourceId: $resourceId) {
      message
    }
  }
`

// ========================================
// ROLE-PERMISSION ASSIGNMENT MUTATIONS
// ========================================

export const ASSIGN_PERMISSION_TO_ROLE_MUTATION = gql`
  mutation AssignPermissionToRole($input: AssignPermissionToRoleInput!) {
    assignPermissionToRole(input: $input) {
      message
    }
  }
`

export const REMOVE_PERMISSION_FROM_ROLE_MUTATION = gql`
  mutation RemovePermissionFromRole($input: RemovePermissionFromRoleInput!) {
    removePermissionFromRole(input: $input) {
      message
    }
  }
`

// ========================================
// USER-PERMISSION DIRECT ASSIGNMENT MUTATIONS
// ========================================

export const GRANT_USER_PERMISSION_MUTATION = gql`
  mutation GrantUserPermission($input: GrantUserPermissionInput!) {
    grantUserPermission(input: $input) {
      message
    }
  }
`

export const REVOKE_USER_PERMISSION_MUTATION = gql`
  mutation RevokeUserPermission($input: RevokeUserPermissionInput!) {
    revokeUserPermission(input: $input) {
      message
    }
  }
`
