import { gql } from 'graphql-tag'

export const HEALTH_QUERY = gql`
  query Health {
    health
  }
`

export const ME_QUERY = gql`
  query Me {
    me {
      id
      email
      firstName
      lastName
      isEmailVerified
      role {
        id
        name
        level
        description
      }
      createdAt
      updatedAt
    }
  }
`

// Get current user's permissions (requires user ID)
export const MY_PERMISSIONS_QUERY = gql`
  query MyPermissions($userId: UUID!) {
    userPermissions(userId: $userId)
  }
`

// Enhanced ME query that attempts to get permissions (may need user ID)
export const ME_WITH_PERMISSIONS_QUERY = gql`
  query MeWithPermissions($userId: UUID!) {
    me {
      id
      email
      firstName
      lastName
      isEmailVerified
      role {
        id
        name
        level
        description
      }
      createdAt
      updatedAt
    }
    userPermissions(userId: $userId)
  }
`

// RBAC Queries - Apollo will generate Vue composables automatically!
export const ALL_USERS_QUERY = gql`
  query AllUsers {
    allUsers {
      id
      email
      firstName
      lastName
      isEmailVerified
      role {
        id
        name
        level
        description
      }
      permissions
      createdAt
      updatedAt
    }
  }
`

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

export const USER_PERMISSIONS_QUERY = gql`
  query UserPermissions($userId: UUID!) {
    userPermissions(userId: $userId)
  }
`

export const USER_BY_ID_QUERY = gql`
  query UserById($userId: UUID!) {
    userById(userId: $userId) {
      id
      email
      firstName
      lastName
      isEmailVerified
      role {
        id
        name
        level
        description
      }
      permissions
      createdAt
      updatedAt
    }
  }
`

export const USERS_BY_ROLE_QUERY = gql`
  query UsersByRole($roleName: String!) {
    usersByRole(roleName: $roleName) {
      id
      email
      firstName
      lastName
      isEmailVerified
      role {
        id
        name
        level
        description
      }
      permissions
      createdAt
      updatedAt
    }
  }
`