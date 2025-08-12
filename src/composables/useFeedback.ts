import { ref, computed } from 'vue'

// Feedback message types
export interface FeedbackMessage {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message: string
  duration?: number // ms, null for persistent
  timestamp: Date
}

// Global feedback state
const messages = ref<FeedbackMessage[]>([])
let messageIdCounter = 0

export function useFeedback() {
  // Add a new feedback message
  const addMessage = (
    type: FeedbackMessage['type'],
    title: string,
    message: string,
    duration = 5000
  ): string => {
    const id = `feedback-${++messageIdCounter}-${Date.now()}`
    
    const feedbackMessage: FeedbackMessage = {
      id,
      type,
      title,
      message,
      duration,
      timestamp: new Date()
    }
    
    messages.value.push(feedbackMessage)
    
    // Auto-remove after duration
    if (duration > 0) {
      setTimeout(() => {
        removeMessage(id)
      }, duration)
    }
    
    return id
  }

  // Remove a specific message
  const removeMessage = (id: string) => {
    const index = messages.value.findIndex(msg => msg.id === id)
    if (index > -1) {
      messages.value.splice(index, 1)
    }
  }

  // Clear all messages
  const clearAll = () => {
    messages.value = []
  }

  // Convenience methods for different message types
  const success = (title: string, message: string, duration?: number) => 
    addMessage('success', title, message, duration)
  
  const error = (title: string, message: string, duration?: number) => 
    addMessage('error', title, message, duration)
  
  const warning = (title: string, message: string, duration?: number) => 
    addMessage('warning', title, message, duration)
  
  const info = (title: string, message: string, duration?: number) => 
    addMessage('info', title, message, duration)

  // Enhanced error categorization helper
  const categorizeGraphQLError = (gqlError: any) => {
    const message = gqlError.message?.toLowerCase() || ''
    const code = gqlError.extensions?.code || ''
    
    // Permission/Authorization errors
    if (
      message.includes('permission') ||
      message.includes('unauthorized') ||
      message.includes('forbidden') ||
      message.includes('access denied') ||
      code === 'FORBIDDEN' ||
      code === 'UNAUTHORIZED'
    ) {
      return { 
        category: 'permission',
        title: 'Access Denied',
        suggestion: 'You may not have the required permissions for this action.'
      }
    }
    
    // Validation errors (enhanced for common cases)
    if (
      message.includes('validation') ||
      message.includes('invalid') ||
      message.includes('required') ||
      message.includes('too long') ||
      message.includes('too short') ||
      message.includes('duplicate') ||
      message.includes('already exists') ||
      message.includes('constraint') ||
      message.includes('name') && (message.includes('length') || message.includes('character')) ||
      message.includes('description') && message.includes('length') ||
      code === 'BAD_USER_INPUT' ||
      code === 'VALIDATION_ERROR'
    ) {
      // Provide more specific titles for common validation scenarios
      let title = 'Invalid Input'
      let suggestion = 'Please check your input and try again.'
      
      if (message.includes('name')) {
        title = 'Invalid Project Name'
        if (message.includes('too long') || message.includes('length')) {
          suggestion = 'Project name is too long. Please use a shorter name.'
        } else if (message.includes('too short')) {
          suggestion = 'Project name is too short. Please use a longer name.'
        } else if (message.includes('character')) {
          suggestion = 'Project name contains invalid characters. Please use only letters, numbers, spaces, and basic punctuation.'
        }
      } else if (message.includes('description')) {
        title = 'Invalid Description'
        suggestion = 'Project description is too long. Please shorten it.'
      } else if (message.includes('duplicate') || message.includes('already exists')) {
        title = 'Name Already Taken'
        suggestion = 'A project with this name already exists. Please choose a different name.'
      }
      
      return {
        category: 'validation',
        title,
        suggestion
      }
    }
    
    // Network/Connectivity issues
    if (
      message.includes('network') ||
      message.includes('timeout') ||
      message.includes('connection') ||
      code === 'NETWORK_ERROR'
    ) {
      return {
        category: 'network',
        title: 'Connection Error',
        suggestion: 'Please check your internet connection and try again.'
      }
    }
    
    // Rate limiting
    if (
      message.includes('rate limit') ||
      message.includes('too many requests') ||
      code === 'RATE_LIMITED'
    ) {
      return {
        category: 'rate_limit',
        title: 'Too Many Requests',
        suggestion: 'Please wait a moment before trying again.'
      }
    }
    
    // Server errors
    if (
      message.includes('internal server error') ||
      message.includes('server error') ||
      code === 'INTERNAL_ERROR' ||
      code === 'INTERNAL_SERVER_ERROR'
    ) {
      return {
        category: 'server',
        title: 'Server Error',
        suggestion: 'Something went wrong on our end. Please try again later.'
      }
    }
    
    // Default/unknown errors
    return {
      category: 'unknown',
      title: 'Operation Failed',
      suggestion: 'An unexpected error occurred. Please try again.'
    }
  }

  // Apollo integration helpers with intelligent error handling
  const fromApolloError = (apolloError: any, customTitle?: string) => {
    // Handle GraphQL errors with smart categorization
    if (apolloError.graphQLErrors?.length > 0) {
      const gqlError = apolloError.graphQLErrors[0]
      const category = categorizeGraphQLError(gqlError)
      
      const title = customTitle || category.title
      
      // Use original error message if it's user-friendly, otherwise use suggestion
      const message = gqlError.message?.length > 0 && gqlError.message.length < 200
        ? gqlError.message 
        : category.suggestion
      
      return error(title, message, category.category === 'validation' ? 6000 : 5000)
    }
    
    // Handle network errors
    if (apolloError.networkError) {
      const isTimeout = apolloError.networkError.message?.includes('timeout')
      return error(
        'Connection Error', 
        isTimeout 
          ? 'The request timed out. Please try again.' 
          : 'Unable to connect to the server. Please check your internet connection.',
        7000
      )
    }
    
    // Fallback for unknown errors
    const title = customTitle || 'Operation Failed'
    return error(title, apolloError.message || 'An unexpected error occurred. Please try again.')
  }

  const fromApolloSuccess = (operation: string, customMessage?: string) => {
    return success(
      'Success',
      customMessage || `${operation} completed successfully`,
      3000
    )
  }

  // Helper for field validation feedback
  const validationError = (field: string, issue: string, suggestion?: string) => {
    const title = `Invalid ${field.charAt(0).toUpperCase() + field.slice(1)}`
    const message = suggestion || `${field} ${issue}. Please check your input and try again.`
    return error(title, message, 6000)
  }

  // Helper for user-friendly error messages
  const friendlyError = (title: string, details: string, action?: string) => {
    const actionText = action ? ` ${action}` : ' Please try again or contact support if the issue persists.'
    return error(title, `${details}${actionText}`, 7000)
  }

  return {
    // State
    messages: computed(() => messages.value),
    
    // Actions
    addMessage,
    removeMessage,
    clearAll,
    
    // Convenience methods
    success,
    error,
    warning,
    info,
    
    // Apollo integration
    fromApolloError,
    fromApolloSuccess,
    
    // Enhanced feedback helpers
    validationError,
    friendlyError
  }
}