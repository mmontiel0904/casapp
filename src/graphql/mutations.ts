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
  mutation AcceptInvitation($invitationToken: String!, $password: String!, $firstName: String, $lastName: String) {
    acceptInvitation(input: { invitationToken: $invitationToken, password: $password, firstName: $firstName, lastName: $lastName }) {
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