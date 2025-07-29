import { apolloClient } from '../lib/apollo'
import type { 
  LoginMutationVariables,
  User,
  AuthPayload,
  MessageResponse
} from '../generated/graphql'
import type { DocumentNode, OperationVariables } from '@apollo/client'
import { gql } from 'graphql-tag'

// Enhanced error types for better error handling
export interface ApiError {
  message: string
  code: string
  details?: Record<string, any>
  timestamp: string
}

export interface ApiResponse<T> {
  data?: T
  error?: ApiError
  loading: boolean
}

// Result wrapper for consistent API responses
export class ApiResult<T> {
  public readonly data?: T
  public readonly error?: ApiError  
  public readonly loading: boolean

  constructor(data?: T, error?: ApiError, loading: boolean = false) {
    this.data = data
    this.error = error
    this.loading = loading
  }

  static success<T>(data: T): ApiResult<T> {
    return new ApiResult(data, undefined, false)
  }

  static error<T>(error: ApiError): ApiResult<T> {
    return new ApiResult<T>(undefined, error, false)
  }

  static loading<T>(): ApiResult<T> {
    return new ApiResult<T>(undefined, undefined, true)
  }

  get isSuccess(): boolean {
    return !!this.data && !this.error && !this.loading
  }

  get isError(): boolean {
    return !!this.error
  }

  get isLoading(): boolean {
    return this.loading
  }
}

// Central error handler
class ErrorHandler {
  private static createApiError(error: any): ApiError {
    const timestamp = new Date().toISOString()
    
    // GraphQL errors
    if (error.graphQLErrors?.length > 0) {
      const gqlError = error.graphQLErrors[0]
      return {
        message: gqlError.message,
        code: gqlError.extensions?.code || 'GRAPHQL_ERROR',
        details: gqlError.extensions,
        timestamp
      }
    }
    
    // Network errors
    if (error.networkError) {
      return {
        message: 'Network connection failed',
        code: 'NETWORK_ERROR',
        details: { originalError: error.networkError.message },
        timestamp
      }
    }
    
    // Generic Apollo errors
    if (error.message) {
      return {
        message: error.message,
        code: 'API_ERROR',
        timestamp
      }
    }
    
    // Fallback for unknown errors
    return {
      message: 'An unexpected error occurred',
      code: 'UNKNOWN_ERROR',
      details: { originalError: error },
      timestamp
    }
  }

  static handle(error: any): ApiError {
    const apiError = this.createApiError(error)
    
    // Log error for debugging (remove in production)
    console.error('[API Error]', {
      code: apiError.code,
      message: apiError.message,
      details: apiError.details,
      timestamp: apiError.timestamp
    })
    
    return apiError
  }
}

// Base API service class
export abstract class BaseApiService {
  protected async executeQuery<TData, TVariables extends OperationVariables = OperationVariables>(
    query: DocumentNode,
    variables?: TVariables
  ): Promise<ApiResult<TData>> {
    try {
      const { data } = await apolloClient.query<TData, TVariables>({
        query,
        variables,
        fetchPolicy: 'cache-first',
        errorPolicy: 'all'
      })
      
      return ApiResult.success(data!)
    } catch (error) {
      return ApiResult.error(ErrorHandler.handle(error))
    }
  }

  protected async executeMutation<TData, TVariables extends OperationVariables = OperationVariables>(
    mutation: DocumentNode,
    variables?: TVariables
  ): Promise<ApiResult<TData>> {
    try {
      const { data } = await apolloClient.mutate<TData, TVariables>({
        mutation,
        variables,
        errorPolicy: 'all'
      })
      
      return ApiResult.success(data!)
    } catch (error) {
      return ApiResult.error(ErrorHandler.handle(error))
    }
  }
}

// Authentication service
export class AuthService extends BaseApiService {
  async login(email: string, password: string): Promise<ApiResult<AuthPayload>> {
    const LOGIN_MUTATION = gql`
      mutation Login($email: String!, $password: String!) {
        login(input: {email: $email, password: $password}) {
          token
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
    
    const result = await this.executeMutation<{login: AuthPayload}, LoginMutationVariables>(
      LOGIN_MUTATION,
      { email, password }
    )
    
    if (result.isSuccess && result.data) {
      return ApiResult.success(result.data.login)
    }
    
    return ApiResult.error(result.error!)
  }

  async register(input: {
    email: string
    password: string
    firstName?: string
    lastName?: string
  }): Promise<ApiResult<User>> {
    const REGISTER_MUTATION = gql`
      mutation Register($input: RegisterInput!) {
        register(input: $input) {
          id
          email
          firstName
          lastName
          isEmailVerified
          createdAt
        }
      }
    `
    
    const result = await this.executeMutation<{register: User}>(
      REGISTER_MUTATION,
      { input }
    )
    
    if (result.isSuccess && result.data) {
      return ApiResult.success(result.data.register)
    }
    
    return ApiResult.error(result.error!)
  }

  async verifyEmail(token: string): Promise<ApiResult<MessageResponse>> {
    const VERIFY_EMAIL_MUTATION = gql`
      mutation VerifyEmail($token: String!) {
        verifyEmail(token: $token) {
          message
        }
      }
    `
    
    const result = await this.executeMutation<{verifyEmail: MessageResponse}>(
      VERIFY_EMAIL_MUTATION,
      { token }
    )
    
    if (result.isSuccess && result.data) {
      return ApiResult.success(result.data.verifyEmail)
    }
    
    return ApiResult.error(result.error!)
  }

  async getCurrentUser(): Promise<ApiResult<User>> {
    const ME_QUERY = gql`
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
    
    const result = await this.executeQuery<{me: User}>(ME_QUERY)
    
    if (result.isSuccess && result.data) {
      return ApiResult.success(result.data.me)
    }
    
    return ApiResult.error(result.error!)
  }
}

// Health service
export class HealthService extends BaseApiService {
  async checkHealth(): Promise<ApiResult<string>> {
    const HEALTH_QUERY = gql`
      query Health {
        health
      }
    `
    
    const result = await this.executeQuery<{health: string}>(HEALTH_QUERY)
    
    if (result.isSuccess && result.data) {
      return ApiResult.success(result.data.health)
    }
    
    return ApiResult.error(result.error!)
  }
}

// Service instances - ready for dependency injection
export const authService = new AuthService()
export const healthService = new HealthService()

