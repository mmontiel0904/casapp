import { gql } from 'graphql-tag'

export const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(input: { email: $email, password: $password }) {
      accessToken
      refreshToken
      user {
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
      }
    }
  }
`

export const REGISTER_MUTATION = gql`
  mutation Register($email: String!, $password: String!, $firstName: String, $lastName: String) {
    register(input: { email: $email, password: $password, firstName: $firstName, lastName: $lastName }) {
      id
      email
      firstName
      lastName
      isEmailVerified
      createdAt
      updatedAt
    }
  }
`

export const INVITE_USER_MUTATION = gql`
  mutation InviteUser($email: String!) {
    inviteUser(input: { email: $email }) {
      id
      email
      inviterUserId
      isUsed
      createdAt
      expiresAt
    }
  }
`

export const ACCEPT_INVITATION_MUTATION = gql`
  mutation AcceptInvitation($input: AcceptInvitationInput!) {
    acceptInvitation(input: $input) {
      user {
        id
        email
        firstName
        lastName
      }
      accessToken
      refreshToken
    }
  }
`

export const REQUEST_PASSWORD_RESET_MUTATION = gql`
  mutation RequestPasswordReset($email: String!) {
    requestPasswordReset(input: { email: $email }) {
      message
    }
  }
`

export const RESET_PASSWORD_MUTATION = gql`
  mutation ResetPassword($token: String!, $newPassword: String!) {
    resetPassword(input: { token: $token, newPassword: $newPassword }) {
      message
    }
  }
`

export const VERIFY_EMAIL_MUTATION = gql`
  mutation VerifyEmail($token: String!) {
    verifyEmail(token: $token) {
      message
    }
  }
`

export const REFRESH_TOKEN_MUTATION = gql`
  mutation RefreshToken($refreshToken: String!) {
    refreshToken(input: { refreshToken: $refreshToken }) {
      accessToken
      refreshToken
      user {
        id
        email
        firstName
        lastName
        isEmailVerified
      }
    }
  }
`

export const LOGOUT_MUTATION = gql`
  mutation Logout {
    logout {
      message
    }
  }
`

export const CHANGE_PASSWORD_MUTATION = gql`
  mutation ChangePassword($currentPassword: String!, $newPassword: String!) {
    changePassword(input: { currentPassword: $currentPassword, newPassword: $newPassword }) {
      message
    }
  }
`

export const ADMIN_RESET_PASSWORD_MUTATION = gql`
  mutation AdminResetUserPassword($userId: UUID!) {
    adminResetUserPassword(input: { userId: $userId }) {
      message
    }
  }
`

// RBAC Mutations - Apollo will generate Vue composables automatically!
export const ASSIGN_ROLE_MUTATION = gql`
  mutation AssignRole($userId: UUID!, $roleId: UUID!) {
    assignRole(input: { userId: $userId, roleId: $roleId }) {
      id
      email
      firstName
      lastName
      role {
        id
        name
        level
        description
      }
    }
  }
`

export const REMOVE_USER_ROLE_MUTATION = gql`
  mutation RemoveUserRole($userId: UUID!) {
    removeUserRole(userId: $userId) {
      id
      email
      firstName
      lastName
      role {
        id
        name
        level
      }
    }
  }
`

export const INVITE_USER_WITH_ROLE_MUTATION = gql`
  mutation InviteUserWithRole($email: String!, $roleId: UUID) {
    inviteUserWithRole(input: { email: $email, roleId: $roleId }) {
      id
      email
      inviterUserId
      isUsed
      createdAt
      expiresAt
      role {
        id
        name
        level
        description
      }
    }
  }
`