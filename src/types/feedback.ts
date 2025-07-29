import type { ApiError } from '../services/api'

// Feedback system types for future UI components
export interface FeedbackMessage {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message: string
  timestamp: Date
  duration?: number | null // ms, null for persistent
  actions?: FeedbackAction[]
}

export interface FeedbackAction {
  label: string
  action: () => void
  variant?: 'primary' | 'secondary' | 'danger'
}

// Convert API errors to feedback messages
export function createErrorFeedback(error: ApiError): FeedbackMessage {
  const getTitle = (code: string): string => {
    switch (code) {
      case 'NETWORK_ERROR':
        return 'Connection Failed'
      case 'GRAPHQL_ERROR':
        return 'Server Error'
      case 'VALIDATION_ERROR':
        return 'Invalid Input'
      case 'UNAUTHORIZED':
        return 'Authentication Required'
      case 'FORBIDDEN':
        return 'Access Denied'
      default:
        return 'Error'
    }
  }

  const getMessage = (error: ApiError): string => {
    // Provide user-friendly messages for common errors
    switch (error.code) {
      case 'NETWORK_ERROR':
        return 'Please check your internet connection and try again.'
      case 'UNAUTHORIZED':
        return 'Please log in to continue.'
      case 'FORBIDDEN':
        return 'You don\'t have permission to perform this action.'
      default:
        return error.message
    }
  }

  return {
    id: `error-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    type: 'error',
    title: getTitle(error.code),
    message: getMessage(error),
    timestamp: new Date(error.timestamp),
    duration: error.code === 'NETWORK_ERROR' ? null : 5000, // Persistent for network errors
    actions: error.code === 'NETWORK_ERROR' ? [
      {
        label: 'Retry',
        action: () => window.location.reload(),
        variant: 'primary'
      }
    ] : undefined
  }
}

export function createSuccessFeedback(
  title: string, 
  message: string, 
  duration = 3000
): FeedbackMessage {
  return {
    id: `success-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    type: 'success',
    title,
    message,
    timestamp: new Date(),
    duration
  }
}

export function createInfoFeedback(
  title: string, 
  message: string, 
  duration = 4000
): FeedbackMessage {
  return {
    id: `info-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    type: 'info',
    title,
    message,
    timestamp: new Date(),
    duration
  }
}

export function createWarningFeedback(
  title: string, 
  message: string, 
  duration?: number | null
): FeedbackMessage {
  return {
    id: `warning-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    type: 'warning',
    title,
    message,
    timestamp: new Date(),
    duration
  }
}