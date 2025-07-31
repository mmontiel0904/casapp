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
      createdAt
      updatedAt
    }
  }
`